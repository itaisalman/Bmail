package com.example.android_application.ui.inbox;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import com.example.android_application.data.local.entity.Mail;
import com.example.android_application.ui.base.MailListViewModel;
import java.util.List;

public class InboxViewModel extends MailListViewModel {

    private final MutableLiveData<List<Mail>> inboxMails = new MutableLiveData<>();
    private final MutableLiveData<String> errorMessage = new MutableLiveData<>();

    public InboxViewModel(@NonNull Application application) {
        super(application);
        getMails("Inbox");
    }

    @Override
    public LiveData<List<Mail>> getMailListLiveData() {
        return inboxMails;
    }

    @Override
    public LiveData<String> getErrorMessage() {
        return errorMessage;
    }

    @Override
    protected void onMailsLoaded(List<Mail> mails, int count) {
        inboxMails.postValue(mails);
    }

    @Override
    public void getMails(String label) {
        super.getMails(label);
    }
}
