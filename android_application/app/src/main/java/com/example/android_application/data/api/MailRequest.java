package com.example.android_application.data.api;

public class MailRequest {
    private final String receiver;
    private final String title;
    private final String content;

    public MailRequest(String receiver, String title, String content) {
        this.receiver = receiver;
        this.title = title;
        this.content = content;
    }

    // Getters (optional if using Retrofit & Gson)
    public String getReceiver() {
        return receiver;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }
}
