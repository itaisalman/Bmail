package com.example.android_application.ui.home;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;
import com.example.android_application.data.local.entity.Mail;
import com.example.android_application.data.repository.MailRepository;
import java.util.List;

public class HomeViewModel extends ViewModel {

    // Optional: your original placeholder text
    private final MutableLiveData<String> mText = new MutableLiveData<>();

    // New: for search results and errors
    private final MutableLiveData<List<Mail>> searchResults = new MutableLiveData<>();
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
