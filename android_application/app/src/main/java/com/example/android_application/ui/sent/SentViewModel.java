package com.example.android_application.ui.sent;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;

import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;
import androidx.lifecycle.ViewModelProvider;

import com.example.android_application.data.local.entity.Mail;
import com.example.android_application.data.repository.MailRepository;
import com.example.android_application.ui.base.MailListViewModel;
import java.util.List;

public class SentViewModel extends MailListViewModel {

    private LiveData<List<Mail>> sentMails;
    private final MailRepository mailRepository;

    public SentViewModel(@NonNull Application application, String currentUserEmail) {
        super(application);
        mailRepository = new MailRepository(application.getApplicationContext());
        getMails("Sent", currentPage);
        sentMails = mailRepository.getSentMailsLive(currentUserEmail);
    }

    @Override
    public LiveData<List<Mail>> getMailListLiveData() {
        return sentMails;
    }

    @Override
    public LiveData<String> getErrorMessage() {
        return error;
    }

    @Override
    protected void onMailsLoaded(List<Mail> mails, int count) {
    }

    @Override
    public void getMails(String label, int page) {
        mailRepository.getMailsByLabel(getUsernameFromStorage(), getTokenFromStorage(), label, page, new MailRepository.MailListCallback() {
            @Override
            public void onSuccess(List<Mail> mails, int totalCount) {}

            @Override
            public void onFailure(String errorMessage) {
                // Handle error
                error.postValue(errorMessage);
            }
        });
    }

    // Retrieve JWT token from SharedPreferences for authorization
    private String getTokenFromStorage() {
        SharedPreferences prefs = getApplication().getSharedPreferences("auth", Context.MODE_PRIVATE);
        return prefs.getString("jwt", "");
    }

    public static class Factory implements ViewModelProvider.Factory {
        private final Application application;
        private final String currentUserEmail;

        public Factory(Application application, String currentUserEmail) {
            this.application = application;
            this.currentUserEmail = currentUserEmail;
        }

        @NonNull
        @Override
        public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
            if (modelClass.isAssignableFrom(SentViewModel.class)) {
                return (T) new SentViewModel(application, currentUserEmail);
            }
            throw new IllegalArgumentException("Unknown ViewModel class");
        }
    }

}
