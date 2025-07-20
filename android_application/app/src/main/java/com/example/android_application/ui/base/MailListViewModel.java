package com.example.android_application.ui.base;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import com.example.android_application.data.local.entity.Mail;
import com.example.android_application.data.repository.MailRepository;
import java.util.List;

public abstract class MailListViewModel extends AndroidViewModel {
    private final MailRepository mailRepository = new MailRepository();
    protected final MutableLiveData<List<Mail>> mailList = new MutableLiveData<>();
    public final MutableLiveData<String> error = new MutableLiveData<>();
    protected int numMails;

    public MailListViewModel(@NonNull Application application) {
        super(application);
        numMails = 0;
    }

    // Retrieve JWT token from SharedPreferences for authorization
    private String getTokenFromStorage() {
        SharedPreferences prefs = getApplication().getSharedPreferences("auth", Context.MODE_PRIVATE);
        return prefs.getString("jwt", "");
    }

    public void getMails(String label) {
        mailRepository.getMailsByLabel(getTokenFromStorage(), label, new MailRepository.MailListCallback() {
            @Override
            public void onSuccess(List<Mail> mails, int count) {
                mailList.postValue(mails);
                numMails = count;
                onMailsLoaded(mails, count);
            }

            @Override
            public void onFailure(String errorMsg) {
                error.postValue(errorMsg);
            }
        });
    }

    protected void onMailsLoaded(List<Mail> mails, int count) {}
    public abstract LiveData<List<Mail>> getMailListLiveData();
    public abstract LiveData<String> getErrorMessage();
}