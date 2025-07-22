package com.example.android_application.data.repository;

import android.content.Context;
import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.Transformations;
import com.example.android_application.data.api.LabelApiService;
import com.example.android_application.data.local.dao.LabelDao;
import com.example.android_application.data.local.AppDatabase;
import com.example.android_application.data.local.dao.MailDao;
import com.example.android_application.data.local.entity.Label;
import com.example.android_application.data.local.entity.Mail;
import java.util.ArrayList;
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
    private final MailDao mailDao;
    private final LabelApiService apiService;
    private final Executor executor;

    /**
     * Initializes the repository with local Room DB and remote Retrofit service.
     */
    public LabelRepository(Context context) {
        AppDatabase db = AppDatabase.getDatabase(context);
        labelDao = db.labelDao();
        mailDao = db.mailDao();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:3000/api/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        apiService = retrofit.create(LabelApiService.class);

        executor = Executors.newSingleThreadExecutor();
    }

    /**
     * Returns all locally stored labels as LiveData.
     */
    public LiveData<List<Label>> getAllLabelsLocal(String user_id) {
        return labelDao.getAllLabels(user_id);
    }

    /**
     * Refreshes local DB by fetching labels from the server and inserting them into Room.
     */
    public void refreshLabelsFromServer(String token, String userId) {
        apiService.getAllUserLabels("Bearer " + token).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<List<Label>> call, @NonNull Response<List<Label>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Label> labels = response.body();
                    for (Label label : labels) {
                        label.setUserId(userId);
                    }
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
    public LiveData<Label> createLabel(String token, String labelName, String userId) {
        MutableLiveData<Label> result = new MutableLiveData<>();
        Map<String, String> body = new HashMap<>();
        body.put("name", labelName);

        apiService.createLabel("Bearer " + token, body).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Label> call, @NonNull Response<Label> response) {
                if (response.isSuccessful()) {
                    refreshLabelsFromServer(token, userId);
                    Label dummy = new Label("temp_id_" + System.currentTimeMillis(), labelName);
                    result.postValue(dummy);
                } else {
                    result.postValue(null);
                }
            }

            @Override
            public void onFailure(@NonNull Call<Label> call, @NonNull Throwable t) {
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

    /**
     * Assigns a label to a mail using a REST API call.
     */
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

    /**
     * Remove a label to a mail using a REST API call.
     */
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

    /**
     * Retrieves all user labels from the server via API call.
     */
    public LiveData<List<Label>> getAllUserLabels(String token) {
        MutableLiveData<List<Label>> data = new MutableLiveData<>();

        apiService.getAllUserLabels("Bearer " + token).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<List<Label>> call, @NonNull Response<List<Label>> response) {
                if (response.isSuccessful()) {
                    data.postValue(response.body());
                } else {
                    data.postValue(null);
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<Label>> call,@NonNull Throwable t) {
                data.postValue(null);
            }
        });

        return data;
    }

    /**
     * Retrieves all mails associated with a specific label (by label name)
     */
    public LiveData<List<Mail>> getLabelMailsLive(String labelName, String user_id, String owner) {
        return Transformations.switchMap(
                labelDao.getAllLabels(user_id),
                labels -> {
                    for (Label label : labels) {
                        if (label.getName().equals(labelName)) {
                            List<String> mailIds = label.getMails();
                            if (mailIds == null || mailIds.isEmpty()) {
                                MutableLiveData<List<Mail>> empty = new MutableLiveData<>();
                                empty.setValue(new ArrayList<>());
                                return empty;
                            }
                            return mailDao.getMailsByIds(mailIds, owner);
                        }
                    }
                    MutableLiveData<List<Mail>> notFound = new MutableLiveData<>();
                    notFound.setValue(new ArrayList<>());
                    return notFound;
                }
        );
    }

}
