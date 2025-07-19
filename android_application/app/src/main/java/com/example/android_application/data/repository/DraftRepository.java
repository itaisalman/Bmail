package com.example.android_application.data.repository;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import com.example.android_application.data.local.AppDatabase;
import com.example.android_application.data.local.dao.DraftDao;
import com.example.android_application.data.local.entity.Draft;
import com.example.android_application.data.api.MailApiService;
import com.example.android_application.data.local.entity.DraftWrapper;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
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

        executorService = Executors.newSingleThreadExecutor();
    }

    public LiveData<List<Draft>> getAllDrafts() {
        return draftDao.getAllDrafts();
    }

    public void insertDraft(Draft draft) {
        executorService.execute(() -> draftDao.insert(draft));
    }

    public void deleteDraft(Draft draft) {
        executorService.execute(() -> draftDao.delete(draft));
    }

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
                    List<Draft> draftsss = draftWrapper.getDrafts();

                    List<Draft> drafts = draftWrapper.getDrafts();
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

    public interface ApiCallback {
        void onSuccess(int fetchedCount);
        void onError(String error);
    }
}
