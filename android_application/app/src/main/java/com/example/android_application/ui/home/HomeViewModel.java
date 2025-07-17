package com.example.android_application.ui.home;

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
import com.example.android_application.data.repository.UserRepository;
import org.json.JSONObject;

public class HomeViewModel extends AndroidViewModel {

    private final UserRepository repository;
    public final MutableLiveData<JSONObject> user = new MutableLiveData<>();
    public final MutableLiveData<String> error = new MutableLiveData<>();

    // LiveData holding search results
    private final MutableLiveData<List<Mail>> searchResults = new MutableLiveData<>();

    private final MailRepository mailRepository = new MailRepository();


    public HomeViewModel(@NonNull Application application) {
        super(application);
        this.repository = new UserRepository();
    }

    public void getUser() {
        repository.getUser(getTokenFromStorage(),
                user::postValue,
                error::postValue
        );
    }

    // Retrieve JWT token from SharedPreferences for authorization
    private String getTokenFromStorage() {
        SharedPreferences prefs = getApplication().getSharedPreferences("auth", Context.MODE_PRIVATE);
        return prefs.getString("jwt", "");
    }

    public LiveData<List<Mail>> getSearchResults() {
        return searchResults;
    }

    // Triggers mail search via repository and updates LiveData accordingly
    public void searchMails(String token, String query) {
        mailRepository.searchMails(token, query, new MailRepository.SearchCallback() {
            @Override
            public void onSuccess(List<Mail> mails) {
                searchResults.postValue(mails);
            }

            @Override
            public void onFailure(String errorMsg) {
                error.postValue(errorMsg);
            }
        });
    }
}