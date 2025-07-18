package com.example.android_application.data.repository;

import com.example.android_application.data.api.MailApiService;
import com.example.android_application.data.api.MailRequest;
import com.example.android_application.data.local.entity.Draft;
import com.example.android_application.data.local.entity.Mail;

import org.json.JSONObject;
import androidx.annotation.NonNull;
import java.util.List;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MailRepository {

    private final MailApiService api;

    public interface RepositoryCallback {
        void onSuccess();
        void onError(String errorMessage);
    }

    public interface SearchCallback {
        void onSuccess(List<Mail> mails);
        void onFailure(String errorMessage);
    }

    public MailRepository() {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:3000/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        api = retrofit.create(MailApiService.class);
    }

    // Sends a mail to the server asynchronously
    public void sendMail(String token, Draft draft, RepositoryCallback callback) {
        MailRequest mailRequest = new MailRequest(
                draft.getTo(),
                draft.getSubject(),
                draft.getBody()
        );

        Call<ResponseBody> call = api.sendMail("Bearer " + token, mailRequest);
        call.enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<ResponseBody> call, @NonNull Response<ResponseBody> response) {
                if (response.isSuccessful()) {
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

    // Saves a draft mail to the server asynchronously
    public void saveDraft(String token, Draft draft, RepositoryCallback callback) {
        MailRequest mailRequest = new MailRequest(
                draft.getTo(),
                draft.getSubject(),
                draft.getBody()
        );

        Call<ResponseBody> call = api.saveDraft("Bearer " + token, mailRequest);
        call.enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<ResponseBody> call, @NonNull Response<ResponseBody> response) {
                if (response.isSuccessful()) {
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
                callback.onError("Save draft error: " + t.getMessage());
            }
        });
    }

    // Searches mails on the server asynchronously using the query string
    public void searchMails(String token, String query, SearchCallback callback) {
        Call<List<Mail>> call = api.searchMails("Bearer " + token, query);
        call.enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<List<Mail>> call, @NonNull Response<List<Mail>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    callback.onSuccess(response.body());
                } else {
                    callback.onFailure("Search failed with code: " + response.code());
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<Mail>> call, @NonNull Throwable t) {
                callback.onFailure("Search error: " + t.getMessage());
            }
        });
    }
    public void getMailById(String token, String mailId, Callback<Mail> callback) {
        Call<Mail> call = api.getMailById("Bearer " + token, mailId);
        call.enqueue(callback);
    }
}
