package com.example.android_application.data.local.entity;

import com.google.gson.annotations.SerializedName;

public class MailWrapper {

    @SerializedName("mail")
    private Mail mail;

    @SerializedName("label")
    private String label;

    public Mail getMail() {
        return mail;
    }

    public String getLabel() {
        return label;
    }
}
