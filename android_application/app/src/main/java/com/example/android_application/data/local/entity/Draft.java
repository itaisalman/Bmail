package com.example.android_application.data.local.entity;

import androidx.annotation.NonNull;
import androidx.room.ColumnInfo;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

import com.google.gson.annotations.SerializedName;

@Entity(tableName = "drafts")
public class Draft {
    @PrimaryKey
    @NonNull
    @SerializedName("_id")
    private String id;

    @SerializedName("receiver_address")
    @ColumnInfo(name = "to")
    private String to;

    @SerializedName("title")
    private String subject;

    @SerializedName("content")
    private String body;


    @ColumnInfo(name = "last_modified")
    private long lastModified;

    public Draft(String to, String subject, String body) {
        this.to = to;
        this.subject = subject;
        this.body = body;
        this.lastModified = System.currentTimeMillis();
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public long getLastModified() { return lastModified; }
    public void setLastModified(long lastModified) { this.lastModified = lastModified; }
}
