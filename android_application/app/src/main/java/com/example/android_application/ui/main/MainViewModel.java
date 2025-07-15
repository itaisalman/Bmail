package com.example.android_application.ui.main;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;

import com.example.android_application.data.repository.AuthRepository;

public class MainViewModel extends AndroidViewModel {

    private final AuthRepository authRepository;

    public MainViewModel(@NonNull Application application) {
        super(application);
        authRepository = new AuthRepository(application);
    }

    public AuthRepository getAuthRepository() {
        return authRepository;
    }
}
