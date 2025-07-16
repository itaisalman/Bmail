package com.example.android_application.ui.bottom_sheet;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;

import com.example.android_application.data.local.entity.Draft;
import com.example.android_application.data.repository.DraftRepository;

public class ComposeViewModel extends AndroidViewModel {

    private final DraftRepository repository;

    // LiveData to notify UI about mail send success
    public final MutableLiveData<Boolean> mailSent = new MutableLiveData<>();

    // LiveData to notify UI about errors
    public final MutableLiveData<String> error = new MutableLiveData<>();

    public ComposeViewModel(@NonNull Application application) {
        super(application);
        repository = new DraftRepository(application);
    }

    // Sends mail using the repository and updates LiveData accordingly
    public void sendMail(String to, String subject, String body) {
        Draft draft = new Draft(to, subject, body);
        repository.sendDraft(draft, new DraftRepository.Callback() {
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

    // Saves a draft locally using the repository
    public void saveDraft(String to, String subject, String body) {
        Draft draft = new Draft(to, subject, body);
        repository.insertDraft(draft);
    }
}