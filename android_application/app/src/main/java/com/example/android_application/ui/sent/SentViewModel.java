package com.example.android_application.ui.sent;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class SentViewModel extends ViewModel {

    private final MutableLiveData<String> mText;

    public SentViewModel() {
        mText = new MutableLiveData<>();
        mText.setValue("This is sent fragment");
    }

    public LiveData<String> getText() {
        return mText;
    }
}