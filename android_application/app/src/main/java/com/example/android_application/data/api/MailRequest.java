package com.example.android_application.data.api;

public class MailRequest {
    private final String receiver;
    private final String title;
    private final String content;

    // Define the payload that will be passed to the nodeJS server
    public MailRequest(String receiver, String title, String content) {
        this.receiver = receiver;
        this.title = title;
        this.content = content;
    }

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
