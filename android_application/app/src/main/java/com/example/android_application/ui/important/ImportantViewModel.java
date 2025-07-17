package com.example.android_application.ui.important;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class ImportantViewModel extends ViewModel {

    private final MutableLiveData<String> mText;

    public ImportantViewModel() {
        mText = new MutableLiveData<>();
        mText.setValue("This is important fragment");
    }

    public LiveData<String> getText() {
        return mText;
    }
}