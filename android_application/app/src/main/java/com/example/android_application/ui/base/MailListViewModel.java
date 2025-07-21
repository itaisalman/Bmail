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
    private final MailRepository mailRepository;
    protected final MutableLiveData<List<Mail>> mailList = new MutableLiveData<>();
    public final MutableLiveData<String> error = new MutableLiveData<>();
    protected int numMails;

    protected int currentPage = 1;
    protected boolean isLoading = false;
    protected boolean isLastPage = false;
    protected final MutableLiveData<Boolean> isLastPageLiveData = new MutableLiveData<>(false);


    public MailListViewModel(@NonNull Application application) {
        super(application);
        mailRepository = new MailRepository(application.getApplicationContext());
        numMails = 0;
    }

    public LiveData<Boolean> getIsLastPageLiveData() {
        return isLastPageLiveData;
    }

    public void initMails(String label) {
        currentPage = 1;
        isLastPage = false;
        loadPage(label, currentPage);
    }

    public void loadNextPage(String label) {
        if (isLoading || isLastPage) return;
        loadPage(label, currentPage);
    }

    private void loadPage(String label, int page) {
        isLoading = true;
        mailRepository.getMailsByLabel(getTokenFromStorage(), label, page, new MailRepository.MailListCallback() {
            @Override
            public void onSuccess(List<Mail> mails, int count) {
                if (page == 1) {
                    mailList.postValue(mails);
                } else {
                    List<Mail> current = mailList.getValue();
                    if (current != null) {
                        current.addAll(mails);
                        mailList.postValue(current);
                    }
                }

                currentPage++;
                numMails = count;
                if (mails.size() < 50) {
                    isLastPage = true;
                    isLastPageLiveData.postValue(true);
                }

                isLoading = false;
            }

            @Override
            public void onFailure(String errorMsg) {
                error.postValue(errorMsg);
                isLoading = false;
            }
        });
    }

    // Retrieve JWT token from SharedPreferences for authorization
    private String getTokenFromStorage() {
        SharedPreferences prefs = getApplication().getSharedPreferences("auth", Context.MODE_PRIVATE);
        return prefs.getString("jwt", "");
    }

    public void getMails(String label, int page) {
        mailRepository.getMailsByLabel(getTokenFromStorage(), label, page, new MailRepository.MailListCallback() {
            @Override
            public void onSuccess(List<Mail> mails, int count) {

                if (label.equalsIgnoreCase("Starred")) {
                    mailRepository.insertStarredMails(mails);
                } else {
                    mailRepository.insertMails(mails);
                }

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