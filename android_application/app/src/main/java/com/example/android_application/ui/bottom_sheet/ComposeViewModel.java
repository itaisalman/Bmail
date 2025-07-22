package com.example.android_application.ui.bottom_sheet;

import android.app.Application;
import android.content.SharedPreferences;
import android.content.Context;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import com.example.android_application.data.local.entity.Mail;
import com.example.android_application.data.repository.DraftRepository;
import com.example.android_application.data.repository.MailRepository;

public class ComposeViewModel extends AndroidViewModel {

    private final MailRepository repository;
    private final DraftRepository draftRepository;

    public final MutableLiveData<Boolean> mailSent = new MutableLiveData<>();
    public final MutableLiveData<Boolean> draftSaved = new MutableLiveData<>();
    public final MutableLiveData<String> error = new MutableLiveData<>();

    // Notifier in order to tell the draft fragment to re-fetch.
    private final MutableLiveData<Boolean> newDraftCreated = new MutableLiveData<>(false);
    
    // Notify whether a draft has been clicked.
    private final MutableLiveData<Boolean> isDraftClicked = new MutableLiveData<>();

    public void clearErrorMessage() {
        error.postValue(null);
    }
    public LiveData<Boolean> getNewDraftCreated() {
        return newDraftCreated;
    }
    public void setNewDraftCreated(boolean created) {
        newDraftCreated.setValue(created);
    }

    public LiveData<Boolean> getIsDraftClicked() {
        return isDraftClicked;
    }

    public void setIsDraftClicked(Boolean b) {
        isDraftClicked.setValue(b);
    }

    public ComposeViewModel(@NonNull Application application) {
        super(application);
        this.repository = new MailRepository(application.getApplicationContext());
        this.draftRepository = new DraftRepository(application.getApplicationContext());
    }
    // Send a mail via MailRepository.
    public void sendMail(String id,String to, String subject, String body) {
        Mail mail = new Mail();
        mail.setOwner(getUsernameFromStorage());
        mail.setReceiverAddress(to);
        mail.setTitle(subject);
        mail.setContent(body);
        repository.sendMail(getUsernameFromStorage(), getTokenFromStorage(), mail, new MailRepository.RepositoryCallback() {
            @Override
            public void onSuccess() {
                mailSent.postValue(true);
                // If a draft is clicked - delete that draft and re-fetch drafts to local DB.
                if (Boolean.TRUE.equals(isDraftClicked.getValue())){
                    draftRepository.deleteDraftById(getTokenFromStorage(), id, new MailRepository.RepositoryCallback() {
                        @Override
                        public void onSuccess() {
                            newDraftCreated.postValue(true);
                            setIsDraftClicked(false);
                        }

                        @Override
                        public void onError(String errorMessage) {
                            error.postValue("Failed to delete draft after sending: " + errorMessage);
                        }
                    });
                }
            }

            @Override
            public void onError(String errorMessage) {
                error.postValue(errorMessage);
            }
        });
    }

    // Save a draft via DraftRepository.
    public void saveDraft(String to, String subject, String body) {
        draftRepository.saveDraft(getTokenFromStorage(), to, subject, body, new MailRepository.RepositoryCallback() {
            @Override
            public void onSuccess() {
                newDraftCreated.postValue(true);
                draftSaved.postValue(true);
            }

            @Override
            public void onError(String errorMessage) {
                error.postValue(errorMessage);
            }
        });
    }

    // Updating an existing draft.
    public void updateDraft(String id, String to, String subject, String body) {
        draftRepository.updateDraft(getTokenFromStorage(), id, to, subject, body, new MailRepository.RepositoryCallback() {
            @Override
            public void onSuccess() {
                newDraftCreated.postValue(true);
                draftSaved.postValue(true);
                // After finish dealing with the update, set isDraftClicked to false again.
                setIsDraftClicked(false);
            }

            @Override
            public void onError(String errorMessage) {
                setIsDraftClicked(false);
                error.postValue(errorMessage);
            }
        });
    }

    // Retrieve JWT token from SharedPreferences for authorization
    private String getTokenFromStorage() {
        SharedPreferences prefs = getApplication().getSharedPreferences("auth", Context.MODE_PRIVATE);
        return prefs.getString("jwt", "");
    }

    private String getUsernameFromStorage() {
        SharedPreferences prefs = getApplication().getSharedPreferences("auth", Context.MODE_PRIVATE);
        return prefs.getString("username", "");
    }
}
