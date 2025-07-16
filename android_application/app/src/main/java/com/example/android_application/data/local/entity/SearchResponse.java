package com.example.android_application.data.local.entity;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class SearchResponse {

    @SerializedName("result")
    private List<MailWrapper> result;

    public List<MailWrapper> getResult() {
        return result;
    }
}

