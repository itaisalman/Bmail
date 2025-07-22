package com.example.android_application.data.repository;

import android.content.Context;
import android.util.Log;
import com.example.android_application.data.api.MailApiService;
import com.example.android_application.data.api.MailRequest;
import com.example.android_application.data.local.AppDatabase;
import com.example.android_application.data.local.dao.MailDao;
import com.example.android_application.data.local.entity.Mail;
import com.example.android_application.data.local.entity.MailPageResponse;
import com.example.android_application.data.local.entity.MailWrapper;
import org.json.JSONObject;
import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MailRepository {

    private final MailApiService api;
    private final MailDao mailDao;
    private final AppDatabase db;
    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    public interface RepositoryCallback {
        void onSuccess();
        void onError(String errorMessage);
    }

    public interface SearchCallback {
        void onSuccess(List<Mail> mails);
        void onFailure(String errorMessage);
    }

    public interface MailListCallback {
        void onSuccess(List<Mail> mails, int totalCount);
        void onFailure(String errorMessage);
    }

    public MailRepository(Context context) {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:3000/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        api = retrofit.create(MailApiService.class);
        db = AppDatabase.getDatabase(context);
        mailDao = db.mailDao();
    }

    public LiveData<Mail> getMailById(String mailId, String owner) {
        return mailDao.getMailByIdLive(mailId, owner);
    }

    public void insertOrUpdateMailFromServer(Mail mailFromServer, String owner) {
        Executors.newSingleThreadExecutor().execute(() -> {
            mailDao.insertMail(mailFromServer);
        });
    }


    public void updateMail(Mail mail, String label, String token) {
        executor.execute(() -> {
            mailDao.updateMail(mail);

            Call<Void> call = null;
            if ("Starred".equalsIgnoreCase(label)) {
                call = api.updateStarStatus("Bearer " + token, mail.getId());
            } else if ("Important".equalsIgnoreCase(label)) {
                call = api.updateImportantStatus("Bearer " + token, mail.getId());
            } else if ("Trash".equalsIgnoreCase(label)) {
                call = api.moveToTrash("Bearer " + token, mail.getId());
            }

            if (call != null) {
                call.enqueue(new Callback<>() {
                    @Override
                    public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                        if (!response.isSuccessful()) {
                            Log.e("MailRepository", "Failed to update " + label + " status for mail: " + mail.getId());
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                        Log.e("MailRepository", "Error updating " + label + " status for mail: " + mail.getId(), t);
                    }
                });
            }
        });
    }


    public LiveData<List<Mail>> getReceivedMailsLive(String owner) {

        return mailDao.getReceivedMailsLive(owner);
    }

    public LiveData<List<Mail>> getSentMailsLive(String senderAddress) {
        return mailDao.getSentMailsLive(senderAddress);
    }

    public LiveData<List<Mail>> getTrashMailsLive(String senderAddress) {
        return mailDao.getTrashMailsLive(senderAddress);
    }

    public LiveData<List<Mail>> getStarredMailsLive(String mailAddress) {
        return mailDao.getStarredMails(mailAddress);
    }

    public LiveData<List<Mail>> getImportantMailsLive(String owner) {
        return mailDao.getImportantMails(owner);
    }

    // Sends a mail to the server asynchronously
    public void sendMail(String owner, String token, Mail mail, RepositoryCallback callback) {
        MailRequest mailRequest = new MailRequest(
                mail.getReceiverAddress(),
                mail.getTitle(),
                mail.getContent()
        );

        Call<ResponseBody> call = api.sendMail("Bearer " + token, mailRequest);
        call.enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<ResponseBody> call, @NonNull Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    refreshAllMailboxes(token, owner);
                    callback.onSuccess();
                } else {
                    try (ResponseBody errorBody = response.errorBody()) {
                        if (errorBody != null) {
                            String errorJson = errorBody.string();
                            JSONObject json = new JSONObject(errorJson);
                            String serverMessage = json.optString("error", "Unknown server error");
                            callback.onError(serverMessage);
                        } else {
                            callback.onError("Unknown server error");
                        }
                    } catch (Exception e) {
                        callback.onError("Unexpected server response.");
                    }
                }
            }

            @Override
            public void onFailure(@NonNull Call<ResponseBody> call, @NonNull Throwable t) {
                callback.onError("Send mail error: " + t.getMessage());
            }
        });
    }

    // Updated to handle List<MailWrapper> from server directly
    public void searchMails(String token, String query, SearchCallback callback) {
        Call<List<MailWrapper>> call = api.searchMails("Bearer " + token, query);
        call.enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<List<MailWrapper>> call, @NonNull Response<List<MailWrapper>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Mail> mails = new ArrayList<>();
                    for (MailWrapper wrapper : response.body()) {
                        if (wrapper.getMail() != null) {
                            mails.add(wrapper.getMail());
                        }
                    }
                    callback.onSuccess(mails);
                } else {
                    callback.onFailure("Search failed with code: " + response.code());
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<MailWrapper>> call, @NonNull Throwable t) {
                callback.onFailure("Search error: " + t.getMessage());
            }
        });
    }

    public void getMailsByLabel(String owner, String token, String label, int page, MailListCallback callback) {
        MutableLiveData<MailPageResponse> responseLiveData = new MutableLiveData<>();
        Call<MailPageResponse> call = api.getMails("Bearer " + token, label, page);
        call.enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<MailPageResponse> call, @NonNull Response<MailPageResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    responseLiveData.postValue(response.body());
                    List<Mail> mails = response.body().getMails();
                    Executors.newSingleThreadExecutor().execute(() -> {
                        for (Mail mail : mails) {
                            mail.setOwner(owner);
                            if (label.equalsIgnoreCase("Starred")) {
                                mail.setStarred(true);
                            }
                            if (label.equalsIgnoreCase("Important")) {
                                mail.setImportant(true);
                            }
                            if (label.equalsIgnoreCase("Trash")) {
                                mail.setTrash(true);
                            }

                            Mail existingMail = mailDao.getMailById(mail.getId(), owner);
                            if (existingMail != null) {
                                mail.setStarred(mail.isStarred() || existingMail.isStarred());
                                mail.setImportant(mail.isImportant() || existingMail.isImportant());
                                mail.setTrash(mail.isTrash() || existingMail.isTrash());
                            }

                            insertOrUpdateMailFromServer(mail, owner);
                        }

                        if (callback != null) {
                            callback.onSuccess(mails, response.body().getTotalCount());
                        }
                    });
                } else {
                    responseLiveData.postValue(new MailPageResponse());
                }
            }

            @Override
            public void onFailure(@NonNull Call<MailPageResponse> call, @NonNull Throwable t) {
                responseLiveData.postValue(new MailPageResponse());
            }
        });
    }

    private void refreshAllMailboxes(String token, String owner) {
        String[] labels = {"Inbox", "Sent", "Spam"};
        for (String label : labels) {
            getMailsByLabel(owner, token, label, 1, null);
        }
    }
}
