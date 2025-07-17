package com.example.android_application.data.local.entity;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;
import androidx.room.ColumnInfo;
import com.google.gson.annotations.SerializedName;

@Entity(tableName = "mails")
public class Mail {

    @PrimaryKey
    @SerializedName("_id")
    @ColumnInfo(name = "id")
    private String id;

    @SerializedName("sender_id")
    @ColumnInfo(name = "sender_id")
    private String senderId;

    @SerializedName("receiver_id")
    @ColumnInfo(name = "receiver_id")
    private String receiverId;

    @SerializedName("title")
    @ColumnInfo(name = "title")
    private String title;

    @SerializedName("content")
    @ColumnInfo(name = "content")
    private String content;

    @SerializedName("date")
    @ColumnInfo(name = "date")
    private String date;

    public Mail() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public String getTitle() {
        return title != null ? title : "";
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content != null ? content : "";
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    @NonNull
    @Override
    public String toString() {
        return "Mail{" +
                "id='" + id + '\'' +
                ", senderId='" + senderId + '\'' +
                ", receiverId='" + receiverId + '\'' +
                ", title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", date='" + date + '\'' +
                '}';
    }
}
