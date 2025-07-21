package com.example.android_application.ui.label;

import android.app.Application;
import android.content.Context;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.android_application.data.local.entity.Label;
import com.example.android_application.data.repository.LabelRepository;

import java.util.List;

public class LabelViewModel extends AndroidViewModel {

    private final LabelRepository labelRepository;

    // LiveData to hold the current list of labels
    private final MutableLiveData<List<Label>> labels = new MutableLiveData<>();
    private final String token;

    public LabelViewModel(@NonNull Application application) {
        super(application);
        labelRepository = new LabelRepository(application);
        token = application.getSharedPreferences("auth", Context.MODE_PRIVATE)
                .getString("jwt", "");
    }

    public LiveData<List<Label>> getLabels() {
        return labels;
    }

    // Fetch labels from the server and update local database
    public void fetchLabels() {
        if (!hasToken()) return;

        // Refresh data from server
        labelRepository.refreshLabelsFromServer(token);
        // Then observe local data
        labelRepository.getAllLabelsLocal().observeForever(labels::postValue);
    }

    // Create a new label
    public LiveData<Label> createLabel(String name) {
        MutableLiveData<Label> result = new MutableLiveData<>();
        if (!hasToken()) {
            result.setValue(null);
            return result;
        }

        // Observe result from repository and post it to caller
        labelRepository.createLabel(token, name).observeForever(result::setValue);
        return result;
    }

    // Update an existing label
    public LiveData<Boolean> updateLabel(String labelId, String newName) {
        return hasToken() ? labelRepository.updateLabel(token, labelId, newName)
                : new MutableLiveData<>(false);
    }

    // Delete an existing label
    public LiveData<Boolean> deleteLabel(String labelId) {
        return hasToken() ? labelRepository.deleteLabel(token, labelId)
                : new MutableLiveData<>(false);
    }

    // Helper method to check if the user has a valid authentication token
    private boolean hasToken() {
        return token != null && !token.isEmpty();
    }

    // Assigns a label to a specific mail
    public LiveData<Boolean> assignLabelToMail(String mailId, String labelId) {
        return hasToken()
                ? labelRepository.assignLabelToMail(token, mailId, labelId)
                : new MutableLiveData<>(false);
    }

    // Removes a label from a specific mail
    public LiveData<Boolean> removeLabelFromMail(String mailId, String labelId) {
        return hasToken()
                ? labelRepository.removeLabelFromMail(token, mailId, labelId)
                : new MutableLiveData<>(false);
    }

    // Retrieves all labels for the current user
    public LiveData<List<Label>> getAllUserLabels(String token) {
        return labelRepository.getAllUserLabels(token);
    }

}
