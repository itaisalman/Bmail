package com.example.android_application.data.api;

import com.google.gson.annotations.SerializedName;

public class MailResponse {

    @SerializedName("success")
    private boolean success;

    @SerializedName("message")
    private String message;

    // Default constructor (optional but recommended)
    public MailResponse() {}

    // Getters
    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    // Setters (optional, if needed)
    public void setSuccess(boolean success) {
        this.success = success;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
