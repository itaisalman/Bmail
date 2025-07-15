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

    // Initialize DAO from the database singleton
    public DraftRepository(Application application) {
        AppDatabase db = AppDatabase.getDatabase(application);
        draftDao = db.draftDao();
    }

    // Insert draft asynchronously
    public void insertDraft(Draft draft) {
        Executors.newSingleThreadExecutor().execute(() -> draftDao.insert(draft));
    }

    // Delete draft asynchronously
    public void deleteDraft(Draft draft) {
        Executors.newSingleThreadExecutor().execute(() -> draftDao.delete(draft));
    }

    // Get all drafts as LiveData for observing changes
    public LiveData<List<Draft>> getAllDrafts() {
        return draftDao.getAllDrafts();
    }

    // Placeholder for sending draft to server (to be replaced with Retrofit)
    public void sendDraft(Draft draft, Callback callback) {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                Thread.sleep(1000); // simulate network delay
                callback.onSuccess();
            } catch (Exception e) {
                callback.onError(e.getMessage());
            }
        });
    }

    // Callback interface for sendDraft results
    public interface Callback {
        void onSuccess();
        void onError(String error);
    }
}