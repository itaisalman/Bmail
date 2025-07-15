package com.example.android_application.ui.signup;

import android.content.Context;
import android.net.Uri;

import androidx.annotation.NonNull;
import androidx.lifecycle.ViewModel;
import androidx.lifecycle.ViewModelProvider;

import com.example.android_application.data.repository.AuthRepository;

import java.util.function.Consumer;

public class SignupViewModel extends ViewModel {
    private final AuthRepository authRepository;
    private final Context context;

    public SignupViewModel(Context context) {
        this.context = context.getApplicationContext();
        this.authRepository = new AuthRepository(this.context);
    }

    public void signup(String firstName, String lastName, String username, String password,
                       String birthDate, String gender, String imagePath,
                       Consumer<String> onSuccess,
                       Consumer<String> onError) {
        Uri imageUri = imagePath != null ? Uri.parse(imagePath) : null;

        authRepository.signup(firstName, lastName, username, password, birthDate, gender,
                imageUri, this.context, onSuccess, onError);
    }



    public static class Factory implements ViewModelProvider.Factory {
        private final Context context;

        public Factory(Context context) {
            this.context = context.getApplicationContext();
        }

        @NonNull
        @Override
        public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
            if (modelClass.isAssignableFrom(SignupViewModel.class)) {
                return (T) new SignupViewModel(context);
            }
            throw new IllegalArgumentException("Unknown ViewModel class");
        }
    }
}
