package com.example.android_application.data.repository;

import com.example.android_application.data.api.UserApiService;

import org.json.JSONObject;
import androidx.annotation.NonNull;

import java.util.function.Consumer;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;


public class UserRepository {

    private final UserApiService api;

    public UserRepository() {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:3000/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        api = retrofit.create(UserApiService.class);
    }

    public void getUser(String token, Consumer<JSONObject> onSuccess, Consumer<String> onError) {
        Call<ResponseBody> call = api.getUser("Bearer " + token);
        call.enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<ResponseBody> call, @NonNull Response<ResponseBody> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        String responseStr = response.body().string();
                        JSONObject json = new JSONObject(responseStr);
                        onSuccess.accept(json);
                    } catch (Exception e) {
                        onError.accept("Failed to parse user data.");
                    }
                } else {
                    try (ResponseBody errorBody = response.errorBody()) {
                        if (errorBody != null) {
                            String errorJson = errorBody.string();
                            JSONObject json = new JSONObject(errorJson);
                            String serverMessage = json.optString("error", "Unknown server error");
                            onError.accept(serverMessage);
                        } else {
                            onError.accept("Unknown server error");
                        }
                    } catch (Exception e) {
                        onError.accept("Unexpected server response.");
                    }
                }
            }

            @Override
            public void onFailure(@NonNull Call<ResponseBody> call, @NonNull Throwable t) {
                onError.accept("Get user error: " + t.getMessage());
            }
        });
    }

}
