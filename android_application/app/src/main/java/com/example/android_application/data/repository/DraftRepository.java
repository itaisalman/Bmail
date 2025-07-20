package com.example.android_application.data.repository;

import android.content.Context;
import android.content.SharedPreferences;
import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import com.example.android_application.data.api.MailRequest;
import com.example.android_application.data.local.AppDatabase;
import com.example.android_application.data.local.dao.DraftDao;
import com.example.android_application.data.local.entity.Draft;
import com.example.android_application.data.api.MailApiService;
import com.example.android_application.data.local.entity.DraftWrapper;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class DraftRepository {

    public static final int PAGE_SIZE = 50;

    private final DraftDao draftDao;
    private final Context context;
    private final MailApiService apiService;
    private final ExecutorService executorService;

    public DraftRepository(Context context) {
        this.context = context.getApplicationContext();

        AppDatabase db = AppDatabase.getDatabase(context);
        draftDao = db.draftDao();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:3000/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        apiService = retrofit.create(MailApiService.class);

        // Single-thread executor for DB operations.
        executorService = Executors.newSingleThreadExecutor();
    }

    // Exposes local drafts to ViewModel/Activity using LiveData.
    public LiveData<List<Draft>> getAllDrafts(String userId) {
        return draftDao.getAllDrafts(userId);
    }

    // Insert one draft into the local Room DB.
    public void insertDraft(Draft draft) {
        executorService.execute(() -> draftDao.insert(draft));
    }

    // Delete a draft from the local Room DB.
    public void deleteDraft(Draft draft) {
        executorService.execute(() -> draftDao.delete(draft));
    }

    // Fetch paginated drafts from server and save them locally.
    public void getAllDraftsFromServer(int page, ApiCallback callback) {
        SharedPreferences prefs = context.getSharedPreferences("auth", Context.MODE_PRIVATE);
        String jwt = prefs.getString("jwt", null);
        if (jwt == null) {
            callback.onError("JWT token is missing");
            return;
        }

        Call<DraftWrapper> call = apiService.getDrafts("Bearer " + jwt, "Draft", page);
        call.enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<DraftWrapper> call, @NonNull Response<DraftWrapper> response) {
                if (response.isSuccessful() && response.body() != null) {
                    DraftWrapper draftWrapper = response.body();
                    List<Draft> drafts = draftWrapper.getDrafts();
                    // Get the userID saved in SharedPreferences in order to extract the drafts that belong to that specific user making the query.
                    SharedPreferences prefs = context.getSharedPreferences("MyPrefs", Context.MODE_PRIVATE);
                    String userId = prefs.getString("userID", "");
                    // Save the given order of drafts from the server (although pagination).
                    int baseIndex = (page - 1) * PAGE_SIZE;
                    for (int i = 0; i < drafts.size(); i++) {
                        Draft d = drafts.get(i);
                        d.setUserId(userId);
                        d.setLastModified(baseIndex + i);
                    }
                    executorService.execute(() -> draftDao.insertDrafts(drafts));
                    callback.onSuccess(drafts.size());
                } else {
                    callback.onError("Server error: " + response.code());
                }
            }

            @Override
            public void onFailure(@NonNull Call<DraftWrapper> call, @NonNull Throwable t) {
                callback.onError(t.getMessage());
            }
        });
    }

    // Saves a draft mail to the server asynchronously
    public void saveDraft(String token, String to, String subject, String body, MailRepository.RepositoryCallback callback) {
        MailRequest mailRequest = new MailRequest(
                to,
                subject,
                body
        );

        Call<ResponseBody> call = apiService.saveDraft("Bearer " + token, mailRequest);
        call.enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<ResponseBody> call, @NonNull Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    // fetch all drafts from the server to sync local DB
                    getAllDraftsFromServer(1, new ApiCallback() {
                        @Override
                        public void onSuccess(int fetchedCount) {
                            // Notify success after refreshing drafts locally
                            callback.onSuccess();
                        }

                        @Override
                        public void onError(String errorMessage) {
                            callback.onError("Failed to refresh drafts after saving: " + errorMessage);
                        }
                    });
                } else {
                    try (ResponseBody errorBody = response.errorBody()) {
                        if (errorBody != null) {
                            String errorJson = errorBody.string();
                            // You might want to parse errorJson for server message
                            callback.onError("Server error: " + errorJson);
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


    // Interface to notify the result of the API call.
    public interface ApiCallback {
        void onSuccess(int fetchedCount);
        void onError(String error);
    }
}
