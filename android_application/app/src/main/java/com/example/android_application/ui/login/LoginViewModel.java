package com.example.android_application.ui.login;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;
import androidx.lifecycle.ViewModelProvider;

import com.example.android_application.data.repository.AuthRepository;

import java.util.function.Consumer;

public class LoginViewModel extends ViewModel {
    private final AuthRepository authRepository;

    private final MutableLiveData<String> errorMessage = new MutableLiveData<>();

    public LoginViewModel(Context context) {
        this.authRepository = new AuthRepository(context);
    }

    public void login(String username, String password,
                      Consumer<String> onSuccess,
                      Consumer<String> onError) {
        authRepository.login(username, password,
                token -> {
                    errorMessage.postValue(null);
                    onSuccess.accept(token);
                },
                error -> {
                    errorMessage.postValue(error);
                    onError.accept(error);
                });
    }

    public static class Factory implements ViewModelProvider.Factory {
        private final Context context;

        public Factory(Context context) {
            this.context = context.getApplicationContext();
        }

        @NonNull
        @Override
        public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
            if (modelClass.isAssignableFrom(LoginViewModel.class)) {
                return (T) new LoginViewModel(context);
            }
            throw new IllegalArgumentException("Unknown ViewModel class");
        }
    }
}
