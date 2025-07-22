package com.example.android_application.ui.label;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;
import androidx.lifecycle.ViewModelProvider;
import com.example.android_application.data.local.entity.Mail;
import com.example.android_application.data.repository.LabelRepository;
import com.example.android_application.data.repository.MailRepository;
import com.example.android_application.ui.base.MailListViewModel;
import java.util.List;

public class LabelMailsViewModel extends MailListViewModel {

    private final LiveData<List<Mail>> labelMails;

    private final MailRepository mailRepository;
    private final LabelRepository labelRepository;

    public LabelMailsViewModel(@NonNull Application application, String currentUserEmail, String labelName) {
        super(application);
        mailRepository = new MailRepository(application.getApplicationContext());
        labelRepository = new LabelRepository(application.getApplicationContext());
        getMails(labelName, currentPage);
        SharedPreferences prefs = getApplication().getSharedPreferences("MyPrefs", Context.MODE_PRIVATE);
        String userId = prefs.getString("userID", null);
        labelMails = labelRepository.getLabelMailsLive(labelName, userId, getUsernameFromStorage());
    }

    @Override
    public LiveData<List<Mail>> getMailListLiveData() {
        return labelMails;
    }

    @Override
    public LiveData<String> getErrorMessage() {
        return error;
    }

    @Override
    public void getMails(String label, int page) {
        mailRepository.getMailsByLabel(getUsernameFromStorage(), getTokenFromStorage(), label, page, new MailRepository.MailListCallback() {
            @Override
            public void onSuccess(List<Mail> mails, int totalCount) {
            }
            @Override
            public void onFailure(String errorMessage) {
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
        private final String labelName;

        public Factory(Application application, String currentUserEmail, String labelName) {
            this.application = application;
            this.currentUserEmail = currentUserEmail;
            this.labelName = labelName;
        }

        @NonNull
        @Override
        public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
            if (modelClass.isAssignableFrom(LabelMailsViewModel.class)) {
                return (T) new LabelMailsViewModel(application, currentUserEmail, labelName);
            }
            throw new IllegalArgumentException("Unknown ViewModel class");
        }
    }
}
