package com.example.android_application.ui.viewMail;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import com.example.android_application.data.local.entity.Mail;
import com.example.android_application.data.repository.MailRepository;

public class ViewMailViewModel extends AndroidViewModel {
    private final MailRepository repository;
    private final MutableLiveData<Boolean> isStarred = new MutableLiveData<>(false);
    private final MutableLiveData<Boolean> isImportant = new MutableLiveData<>(false);
    private final MutableLiveData<Boolean> isTrash = new MutableLiveData<>(false);
    private final MutableLiveData<Mail> mailLiveData = new MutableLiveData<>();

    private Mail currentMail;

    public ViewMailViewModel(@NonNull Application application) {
        super(application);
        repository = new MailRepository(application.getApplicationContext());
    }

    public LiveData<Mail> loadMailById(String mailId) {
        return repository.getMailById(mailId, getUsernameFromStorage());
    }

    public void setMail(Mail mail) {
        currentMail = mail;
        isStarred.setValue(mail.isStarred());
        isImportant.setValue(mail.isImportant());
        isTrash.setValue(mail.isTrash());
        mailLiveData.setValue(mail);
    }

    public LiveData<Boolean> getIsStarred() {
        return isStarred;
    }

    public LiveData<Boolean> getIsImportant() {
        return isImportant;
    }

    public LiveData<Boolean> getIsTrash() {
        return isTrash;
    }

    public LiveData<Mail> getMailLiveData() {
        return mailLiveData;
    }

    public void toggleStarred() {
        if (currentMail == null) return;

        boolean newStarred = !(isStarred.getValue() != null && isStarred.getValue());
        isStarred.setValue(newStarred);
        currentMail.setStarred(newStarred);
        // Update server and room
        repository.updateMail(currentMail, "Starred", getTokenFromStorage());
    }

    public void toggleImportant() {
        if (currentMail == null) return;

        boolean newImportant = !(isImportant.getValue() != null && isImportant.getValue());
        isImportant.setValue(newImportant);
        currentMail.setImportant(newImportant);
        // Update server and room
        repository.updateMail(currentMail, "Important", getTokenFromStorage());
    }

    private String getTokenFromStorage() {
        SharedPreferences prefs = getApplication().getSharedPreferences("auth", Context.MODE_PRIVATE);
        return prefs.getString("jwt", "");
    }


    private String getUsernameFromStorage() {
        SharedPreferences prefs = getApplication().getSharedPreferences("auth", Context.MODE_PRIVATE);
        return prefs.getString("username", "");
    }

    public void moveToTrash(String label) {
        if (currentMail == null || (label.equalsIgnoreCase("Trash"))) return;

        isTrash.setValue(true);
        isStarred.setValue(false);
        isImportant.setValue(false);
        currentMail.setTrash(true);
        // Update server and room
        repository.updateMail(currentMail, "Trash", getTokenFromStorage());

    }
}
