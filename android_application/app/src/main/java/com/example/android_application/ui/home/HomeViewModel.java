package com.example.android_application.ui.home;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;
import com.example.android_application.data.local.entity.Mail;
import com.example.android_application.data.repository.MailRepository;
import java.util.List;

public class HomeViewModel extends ViewModel {

    // Placeholder text for UI (optional)
    private final MutableLiveData<String> mText = new MutableLiveData<>();

    // LiveData holding search results
    private final MutableLiveData<List<Mail>> searchResults = new MutableLiveData<>();

    // LiveData holding error messages from search
    private final MutableLiveData<String> errorMessage = new MutableLiveData<>();


    private final MailRepository repository = new MailRepository();

    public HomeViewModel() {
        mText.setValue("This is home fragment");
    }

    public LiveData<String> getText() {
        return mText;
    }

    public LiveData<List<Mail>> getSearchResults() {
        return searchResults;
    }

    public LiveData<String> getErrorMessage() {
        return errorMessage;
    }

    // Triggers mail search via repository and updates LiveData accordingly
    public void searchMails(String token, String query) {
        repository.searchMails(token, query, new MailRepository.SearchCallback() {
            @Override
            public void onSuccess(List<Mail> mails) {
                searchResults.postValue(mails);
            }

            @Override
            public void onFailure(String error) {
                errorMessage.postValue(error);
            }
        });
    }
}
