package com.example.android_application.data.repository;

import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.android_application.data.api.LabelApiService;
import com.example.android_application.data.local.entity.Label;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class LabelRepository {
    private final LabelApiService apiService;

    public LabelRepository() {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:3000/api/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

         this.apiService = retrofit.create(LabelApiService.class);
    }

    // Sends a GET request to the server and returns the list
    public LiveData<List<Label>> getAllUserLabels(String token) {
        MutableLiveData<List<Label>> data = new MutableLiveData<>();

        apiService.getAllUserLabels("Bearer " + token).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<List<Label>> call, @NonNull Response<List<Label>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    data.setValue(response.body());
                } else {
                    data.setValue(null);
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<Label>> call, @NonNull Throwable t) {
                data.setValue(null);
            }
        });

        return data;
    }

    public LiveData<Label> createLabel(String token, String labelName) {
        MutableLiveData<Label> result = new MutableLiveData<>();
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("name", labelName);

        apiService.createLabel("Bearer " + token, requestBody).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Label> call,@NonNull Response<Label> response) {
                if (response.isSuccessful() && response.body() != null) {
                    result.setValue(response.body());
                } else {
                    result.setValue(null);
                }
            }

            @Override
            public void onFailure(@NonNull Call<Label> call, @NonNull Throwable t) {
                result.setValue(null);
            }
        });

        return result;
    }
}
