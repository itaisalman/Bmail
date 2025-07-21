package com.example.android_application.ui.login;

import android.content.Context;
import android.content.SharedPreferences;
import androidx.annotation.NonNull;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;
import androidx.lifecycle.ViewModelProvider;
import com.example.android_application.data.local.entity.User;
import com.example.android_application.data.repository.AuthRepository;
import com.example.android_application.data.repository.UserRepository;
import org.json.JSONObject;
import java.util.function.Consumer;

public class LoginViewModel extends ViewModel {
    private final AuthRepository authRepository;
    private final UserRepository userRepository;
    public final MutableLiveData<User> user = new MutableLiveData<>();
    private final Context context;
    private final MutableLiveData<String> errorMessage = new MutableLiveData<>();

    public LoginViewModel(Context context) {
        this.context = context.getApplicationContext();
        this.authRepository = new AuthRepository(this.context);
        this.userRepository = new UserRepository();
    }


    public void getUser(String token) {
        userRepository.getUser(token,
                json -> {
                    User u = parseUserFromJson(json);
                    user.postValue(u);
                    loadUserDataToPreferences(u);
                },
                errorMessage::postValue
        );
    }

    private void loadUserDataToPreferences(User user) {
        SharedPreferences prefs = context.getSharedPreferences("auth", Context.MODE_PRIVATE);
        prefs.edit().putString("first_name", user.getFirstName()).apply();
        prefs.edit().putString("last_name", user.getLastName()).apply();
        prefs.edit().putString("gender", user.getGender()).apply();
        prefs.edit().putString("image", user.getImage()).apply();
        prefs.edit().putString("username", user.getUsername()).apply();
        prefs.edit().putString("theme", user.getTheme()).apply();
    }

    public void login(String username, String password,
                      Consumer<String> onSuccess,
                      Consumer<String> onError) {
        authRepository.login(username, password,
                token -> {
                    errorMessage.postValue(null);
                    getUser(token);
                    onSuccess.accept(token);
                },
                error -> {
                    errorMessage.postValue(error);
                    onError.accept(error);
                });
    }

    private User parseUserFromJson(JSONObject json) {
        return new User(
                json.optString("_id"),
                json.optString("first_name"),
                json.optString("last_name"),
                json.optString("gender"),
                json.optString("username"),
                json.optString("image"),
                json.optString("theme")
        );
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
