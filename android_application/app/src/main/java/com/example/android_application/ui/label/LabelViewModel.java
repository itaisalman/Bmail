package com.example.android_application.ui.label;

import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;
import androidx.lifecycle.ViewModelProvider;
import com.example.android_application.data.local.entity.Label;
import com.example.android_application.data.repository.LabelRepository;
import java.util.List;

public class LabelViewModel extends ViewModel {
    private final LabelRepository repository;
    private final MutableLiveData<List<Label>> labelsLiveData = new MutableLiveData<>();

    public LabelViewModel(LabelRepository repository) {
        this.repository = repository;
    }

    public LiveData<List<Label>> getLabels(String token) {
        if (labelsLiveData.getValue() == null) {
            fetchLabels(token);
        }
        return labelsLiveData;
    }

    public void fetchLabels(String token) {
        repository.getAllUserLabels(token).observeForever(labels -> {
            if (labels != null) {
                labelsLiveData.setValue(labels);
            }
        });
    }

    public LiveData<Label> createLabel(String token, String labelName) {
        return repository.createLabel(token, labelName);
    }

    public static class Factory implements ViewModelProvider.Factory {
        @NonNull
        @Override
        public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
            return (T) new LabelViewModel(new LabelRepository());
        }
    }
}
