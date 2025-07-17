package com.example.android_application.ui.spam;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class SpamViewModel extends ViewModel {

    private final MutableLiveData<String> mText;

    public SpamViewModel() {
        mText = new MutableLiveData<>();
        mText.setValue("This is spam fragment");
    }

    public LiveData<String> getText() {
        return mText;
    }
}