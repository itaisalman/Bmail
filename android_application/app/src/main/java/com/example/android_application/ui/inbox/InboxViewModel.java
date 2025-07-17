package com.example.android_application.ui.inbox;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class InboxViewModel extends ViewModel {

    private final MutableLiveData<String> mText;

    public InboxViewModel() {
        mText = new MutableLiveData<>();
        mText.setValue("This is inbox fragment");
    }

    public LiveData<String> getText() {
        return mText;
    }
}