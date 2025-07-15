package com.example.android_application.data.repository;

import android.app.Application;
import androidx.lifecycle.LiveData;

import com.example.android_application.data.local.AppDatabase;
import com.example.android_application.data.local.entity.Draft;
import com.example.android_application.data.local.dao.DraftDao;

import java.util.List;
import java.util.concurrent.Executors;

public class DraftRepository {

    private final DraftDao draftDao;

    public DraftRepository(Application application) {
        AppDatabase db = AppDatabase.getDatabase(application);
        this.draftDao = db.draftDao();
    }

    public void insertDraft(Draft draft) {
        Executors.newSingleThreadExecutor().execute(() -> draftDao.insert(draft));
    }

    public void deleteDraft(Draft draft) {
        Executors.newSingleThreadExecutor().execute(() -> draftDao.delete(draft));
    }

    public LiveData<List<Draft>> getAllDrafts() {
        return draftDao.getAllDrafts();
    }

    public void sendDraft(Draft draft, Callback callback) {
        // Replace this with Retrofit logic
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                Thread.sleep(1000); // simulate sending
                callback.onSuccess();
            } catch (Exception e) {
                callback.onError(e.getMessage());
            }
        });
    }

    public interface Callback {
        void onSuccess();
        void onError(String error);
    }
}
