package com.example.android_application.ui.bottom_sheet;

import android.app.Application;
import android.content.SharedPreferences;
import android.content.Context;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;

import com.example.android_application.data.local.AppDatabase;
import com.example.android_application.data.local.entity.Draft;
import com.example.android_application.data.repository.MailRepository;

public class ComposeViewModel extends AndroidViewModel {

    private final MailRepository repository;

    public final MutableLiveData<Boolean> mailSent = new MutableLiveData<>();
    public final MutableLiveData<Boolean> draftSaved = new MutableLiveData<>();
    public final MutableLiveData<String> error = new MutableLiveData<>();

    public ComposeViewModel(@NonNull Application application) {
        super(application);
        this.repository = new MailRepository();
    }
    // Method to send a mail via repository
    public void sendMail(String to, String subject, String body) {
        Draft draft = new Draft(to, subject, body);
        repository.sendMail(getTokenFromStorage(), draft, new MailRepository.RepositoryCallback() {
            @Override
            public void onSuccess() {
                mailSent.postValue(true);
            }

            @Override
            public void onError(String errorMessage) {
                error.postValue(errorMessage);
            }
        });
    }

    // Method to save draft via repository
    public void saveDraft(String to, String subject, String body) {
        Draft draft = new Draft(to, subject, body);
        repository.saveDraft(getTokenFromStorage(), draft, new MailRepository.RepositoryCallback() {
            @Override
            public void onSuccess() {
                draftSaved.postValue(true);
            }

            @Override
            public void onError(String errorMessage) {
                error.postValue(errorMessage);
            }
        });
    }

    // Retrieve JWT token from SharedPreferences for authorization
    private String getTokenFromStorage() {
        SharedPreferences prefs = getApplication().getSharedPreferences("auth", Context.MODE_PRIVATE);
        return prefs.getString("jwt", "");
    }
}
