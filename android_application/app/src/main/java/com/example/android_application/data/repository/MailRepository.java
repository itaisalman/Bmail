package com.example.android_application.data.repository;

import android.content.Context;

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

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;

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

    public LiveData<List<Mail>> getReceivedMailsLive(String receiverAddress) {

        return mailDao.getReceivedMailsLive(receiverAddress);
    }

    public void insertMails(List<Mail> mails) {
        new Thread(() -> mailDao.insert(mails)).start();
    }


    // Sends a mail to the server asynchronously
    public void sendMail(String token, Mail mail, RepositoryCallback callback) {
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
                    refreshAllMailboxes(token);
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

    public void getMailsByLabel(String token, String label,int page, MailListCallback callback) {
        MutableLiveData<MailPageResponse> responseLiveData = new MutableLiveData<>();
        Call<MailPageResponse> call = api.getMails("Bearer " + token, label, page);
        call.enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<MailPageResponse> call, @NonNull Response<MailPageResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    responseLiveData.postValue(response.body());
                    List<Mail> mails = response.body().getMails();
                    new Thread(() -> mailDao.insert(mails)).start();
                    if (callback != null) {
                        callback.onSuccess(response.body().getMails(), response.body().getTotalCount());
                    }
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

    private void refreshAllMailboxes(String token) {
        String[] labels = {"Inbox", "Sent", "Spam"};
        for (String label : labels) {
            getMailsByLabel(token, label, 1, null);
        }
    }
}
