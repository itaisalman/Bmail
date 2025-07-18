package com.example.android_application.data.local.entity;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class Label {

    @SerializedName("_id")
    private String id;

    private String name;

    private String user;

    private List<String> mails;

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getUser() {
        return user;
    }

    public List<String> getMails() {
        return mails;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public void setMails(List<String> mails) {
        this.mails = mails;
    }
}
