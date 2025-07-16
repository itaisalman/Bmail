package com.example.android_application.ui.home;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;

import com.example.android_application.data.repository.UserRepository;

import org.json.JSONObject;

public class HomeViewModel extends AndroidViewModel {

    private final UserRepository repository;
    public final MutableLiveData<JSONObject> user = new MutableLiveData<>();
    public final MutableLiveData<String> error = new MutableLiveData<>();


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
}
