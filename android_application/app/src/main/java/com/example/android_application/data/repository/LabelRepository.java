package com.example.android_application.data.repository;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.android_application.data.api.LabelApiService;
import com.example.android_application.data.local.dao.LabelDao;
import com.example.android_application.data.local.AppDatabase;
import com.example.android_application.data.local.entity.Label;
import com.example.android_application.data.local.entity.Mail;
import com.google.gson.Gson;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class LabelRepository {

    private final LabelDao labelDao;
    private final LabelApiService apiService;
    private final Executor executor;

    /**
     * Initializes the repository with local Room DB and remote Retrofit service.
     */
    public LabelRepository(Context context) {
        // Room
        AppDatabase db = AppDatabase.getDatabase(context);
        labelDao = db.labelDao();

        // Retrofit
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:3000/api/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        apiService = retrofit.create(LabelApiService.class);

        // Thread executor
        executor = Executors.newSingleThreadExecutor();
    }

    /**
     * Returns all locally stored labels as LiveData.
     */
    public LiveData<List<Label>> getAllLabelsLocal() {
        return labelDao.getAllLabels();
    }

    /**
     * Refreshes local DB by fetching labels from the server and inserting them into Room.
     */
    public void refreshLabelsFromServer(String token) {
        apiService.getAllUserLabels("Bearer " + token).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<List<Label>> call, @NonNull Response<List<Label>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    // Insert server response into local database on background thread
                    executor.execute(() -> labelDao.insertAll(response.body()));
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<Label>> call, @NonNull Throwable t) {
            }
        });
    }

    /**
     * Sends a POST request to create a new label on the server.
     * On success, updates local DB and returns a dummy label object.
     */
    public LiveData<Label> createLabel(String token, String labelName) {
        MutableLiveData<Label> result = new MutableLiveData<>();
        Map<String, String> body = new HashMap<>();
        body.put("name", labelName);

        apiService.createLabel("Bearer " + token, body).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Label> call, @NonNull Response<Label> response) {
                if (response.isSuccessful()) {
                    Log.d("LabelRepository", "Raw JSON: " + new Gson().toJson(response.body()));
                    refreshLabelsFromServer(token);

                    Label dummy = new Label("temp_id_" + System.currentTimeMillis(), labelName);
                    result.postValue(dummy);
                } else {
                    Log.e("LabelRepository", "Create failed: " + response.code());
                    result.postValue(null);
                }
            }

            @Override
            public void onFailure(@NonNull Call<Label> call, @NonNull Throwable t) {
                Log.e("LabelRepository", "Create label failed", t);
                result.postValue(null);
            }
        });

        return result;
    }

    /**
     * Sends a PUT request to update a label's name on the server.
     * On success, updates the label in the local DB.
     */
    public LiveData<Boolean> updateLabel(String token, String labelId, String newName) {
        MutableLiveData<Boolean> result = new MutableLiveData<>();
        Map<String, String> body = new HashMap<>();
        body.put("name", newName);

        apiService.updateLabel("Bearer " + token, labelId, body).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    executor.execute(() -> {
                        Label updated = new Label(labelId, newName);
                        labelDao.updateLabel(updated);
                        result.postValue(true);
                    });
                } else {
                    result.postValue(false);
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                result.postValue(false);
            }
        });

        return result;
    }

    /**
     * Sends a DELETE request to remove a label from the server.
     * On success, deletes it from the local DB.
     */
    public LiveData<Boolean> deleteLabel(String token, String labelId) {
        MutableLiveData<Boolean> result = new MutableLiveData<>();

        apiService.deleteLabel("Bearer " + token, labelId).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    executor.execute(() -> {
                        labelDao.deleteById(labelId);
                        result.postValue(true);
                    });
                } else {
                    result.postValue(false);
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                result.postValue(false);
            }
        });

        return result;
    }

    public LiveData<Boolean> assignLabelToMail(String token, String mailId, String labelId) {
        MutableLiveData<Boolean> result = new MutableLiveData<>();
        Map<String, String> body = new HashMap<>();
        body.put("label_id", labelId);

        apiService.assignLabelToMail("Bearer " + token, mailId, body).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                result.postValue(response.isSuccessful());
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                result.postValue(false);
            }
        });

        return result;
    }

    public LiveData<Boolean> removeLabelFromMail(String token, String mailId, String labelId) {
        MutableLiveData<Boolean> result = new MutableLiveData<>();
        Map<String, String> body = new HashMap<>();
        body.put("label_id", labelId);

        apiService.removeLabelFromMail("Bearer " + token, mailId, body).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                result.postValue(response.isSuccessful());
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                result.postValue(false);
            }
        });

        return result;
    }

    public LiveData<List<Mail>> getMailsForLabel(String labelId, String token) {
        MutableLiveData<List<Mail>> data = new MutableLiveData<>();
        apiService.getMailsForLabel("Bearer " + token, labelId).enqueue(new Callback<List<Mail>>() {
            @Override
            public void onResponse(Call<List<Mail>> call, Response<List<Mail>> response) {
//                if (response.isSuccessful()) {
//                    data.postValue(response.body());
//                } else {
//                    data.postValue(null);
//                }
                if (response.isSuccessful()) {
                    Log.d("LabelRepo", "Loaded mails: " + response.body().size());
                    data.postValue(response.body());
                } else {
                    Log.e("LabelRepo", "Failed response: " + response.code());
                    try {
                        Log.e("LabelRepo", "Error body: " + response.errorBody().string());
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    data.postValue(null);
                }
            }

            @Override
            public void onFailure(Call<List<Mail>> call, Throwable t) {
                data.postValue(null);
            }
        });
        return data;
    }

    public LiveData<Label> getLabelById(String labelId) {
        MutableLiveData<Label> data = new MutableLiveData<>();
        getAllLabelsLocal().observeForever(labels -> {
            for (Label label : labels) {
                if (label.getId().equals(labelId)) {
                    data.postValue(label);
                    return;
                }
            }
            data.postValue(null);
        });
        return data;
    }




}
