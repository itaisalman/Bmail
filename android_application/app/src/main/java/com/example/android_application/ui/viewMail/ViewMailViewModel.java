package com.example.android_application.ui.viewMail;
import com.example.android_application.data.local.entity.Mail;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;
import com.example.android_application.data.repository.MailRepository;

public class ViewMailViewModel extends ViewModel {

    private final MutableLiveData<Mail> mail = new MutableLiveData<>();
    private final MailRepository repository = new MailRepository();

    private final MutableLiveData<String> errorMessage = new MutableLiveData<>();
    public LiveData<String> getErrorMessage() {
        return errorMessage;
    }


    public LiveData<Mail> getMail() {
        return mail;
    }

    public void loadMail(String token, String mailId) {
        repository.getMailByIdWithUsername(token, mailId, new MailRepository.MailWithUserCallback() {
            @Override
            public void onSuccess(Mail mailWithUsername) {
                mail.setValue(mailWithUsername);
            }

            @Override
            public void onError(String message) {
                errorMessage.setValue(message);
            }
        });
    }

}