package com.example.android_application.ui.star;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class StarViewModel extends ViewModel {

    private final MutableLiveData<String> mText;

    public StarViewModel() {
        mText = new MutableLiveData<>();
        mText.setValue("This is starred fragment");
    }

    public LiveData<String> getText() {
        return mText;
    }
}