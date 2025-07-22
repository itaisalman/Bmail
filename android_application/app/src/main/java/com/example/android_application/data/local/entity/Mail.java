package com.example.android_application.data.local.entity;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;
import androidx.room.ColumnInfo;
import java.io.Serializable;
import com.google.gson.annotations.SerializedName;
@Entity(tableName = "mails")
public class Mail implements Serializable {

    @PrimaryKey
    @NonNull
    @SerializedName("_id")
    @ColumnInfo(name = "id")
    private String id = "";

    @SerializedName("sender_id")
    @ColumnInfo(name = "sender_id")
    private String senderId;

    @SerializedName("sender_address")
    @ColumnInfo(name = "sender_address")
    private String senderAddress;

    @SerializedName("sender_first_name")
    @ColumnInfo(name = "sender_first_name")
    private String senderFirstName;

    @SerializedName("sender_last_name")
    @ColumnInfo(name = "sender_last_name")
    private String senderLastName;

    @SerializedName("receiver_id")
    @ColumnInfo(name = "receiver_id")
    private String receiverId;

    @SerializedName("receiver_address")
    @ColumnInfo(name = "receiver_address")
    private String receiverAddress;

    @SerializedName("receiver_first_name")
    @ColumnInfo(name = "receiver_first_name")
    private String receiverFirstName;

    @SerializedName("receiver_last_name")
    @ColumnInfo(name = "receiver_last_name")
    private String receiverLastName;

    @SerializedName("title")
    @ColumnInfo(name = "title")
    private String title;

    @SerializedName("content")
    @ColumnInfo(name = "content")
    private String content;

    @SerializedName("date")
    @ColumnInfo(name = "date")
    private String date;

    @ColumnInfo(name = "is_starred")
    private boolean isStarred = false;

    @ColumnInfo(name = "is_important")
    private boolean isImportant = false;

    @ColumnInfo(name = "is_spam")
    private boolean isSpam = false;

    @ColumnInfo(name = "is_trash")
    private boolean isTrash = false;


    // Constructor, getters, setters below...

    public Mail() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }

    public String getSenderAddress() { return senderAddress; }
    public void setSenderAddress(String senderAddress) { this.senderAddress = senderAddress; }

    public String getSenderFirstName() { return senderFirstName; }
    public void setSenderFirstName(String senderFirstName) { this.senderFirstName = senderFirstName; }

    public String getSenderLastName() { return senderLastName; }
    public void setSenderLastName(String senderLastName) { this.senderLastName = senderLastName; }

    public String getReceiverId() { return receiverId; }
    public void setReceiverId(String receiverId) { this.receiverId = receiverId; }

    public String getReceiverAddress() { return receiverAddress; }
    public void setReceiverAddress(String receiverAddress) { this.receiverAddress = receiverAddress; }

    public String getReceiverFirstName() { return receiverFirstName; }
    public void setReceiverFirstName(String receiverFirstName) { this.receiverFirstName = receiverFirstName; }

    public String getReceiverLastName() { return receiverLastName; }
    public void setReceiverLastName(String receiverLastName) { this.receiverLastName = receiverLastName; }

    public String getTitle() { return title != null ? title : ""; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content != null ? content : ""; }
    public void setContent(String content) { this.content = content; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public boolean isStarred() { return isStarred; }
    public void setStarred(boolean starred) { isStarred = starred; }

    public boolean isImportant() { return isImportant; }
    public void setImportant(boolean important) { isImportant = important; }

    public boolean isSpam() { return isSpam; }
    public void setSpam(boolean spam) { isSpam = spam; }

    public boolean isTrash() { return isTrash; }
    public void setTrash(boolean trash) { isTrash = trash; }
}
