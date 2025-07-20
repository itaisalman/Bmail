package com.example.android_application.data.local.entity;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class MailPageResponse {
    @SerializedName("mails")
    private List<Mail> mails;

    @SerializedName("totalCount")
    private int totalCount;

    public List<Mail> getMails() {
        return mails;
    }

    public int getTotalCount() {
        return totalCount;
    }
}

