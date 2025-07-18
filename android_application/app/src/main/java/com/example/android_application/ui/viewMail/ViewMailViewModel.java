package com.example.android_application.ui.viewMail;
import com.example.android_application.data.local.entity.Mail;

import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;
import com.example.android_application.data.repository.MailRepository;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ViewMailViewModel extends ViewModel {

    private final MutableLiveData<Mail> mail = new MutableLiveData<>();
    private final MailRepository repository = new MailRepository();

    private final MutableLiveData<String> errorMessage = new MutableLiveData<>();
    public LiveData<String> getErrorMessage() {
        return errorMessage;
    }


    public LiveData<Mail> getMail() {
        return mail;
    }
    public void loadMail(String token, String mailId) {
    repository.getMailById(token, mailId, new Callback<>() {
        @Override
        public void onResponse(@NonNull Call<Mail> call, @NonNull Response<Mail> response) {
            if (response.isSuccessful() && response.body() != null) {
                mail.setValue(response.body());
            } else {
                errorMessage.setValue("Mail not found: " + response.code());
            }
        }

        @Override
        public void onFailure(@NonNull Call<Mail> call, @NonNull Throwable t) {
            errorMessage.setValue("Network error: " + t.getMessage());
        }
    });
}

}