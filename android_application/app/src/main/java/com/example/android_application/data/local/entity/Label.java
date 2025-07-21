package com.example.android_application.data.local.entity;

import androidx.annotation.NonNull;
import androidx.room.ColumnInfo;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

import com.google.gson.annotations.SerializedName;

import java.util.List;

@Entity(tableName = "labels")
public class Label {

    @PrimaryKey
    @NonNull
    @SerializedName("_id")
    @ColumnInfo(name = "id")
    private String _id;

    @ColumnInfo(name = "name")
    private String name;

    @SerializedName("mails")
    @ColumnInfo(name = "mails")
    private List<String> mails;

    @ColumnInfo(name = "user_id")
    public String userId;

    // Constructors
    public Label(@NonNull String _id, String name) {
        this._id = _id;
        this.name = name;
    }

    public Label() {}

    @NonNull
    public String getId() { return _id; }

    public void setId(String id) { this._id = id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public List<String> getMails() {
        return mails;
    }

    public void setMails(List<String> mails) {
        this.mails = mails;
    }

    public String getUserId() { return userId; }

    public void setUserId(String userId) { this.userId = userId; }

}
