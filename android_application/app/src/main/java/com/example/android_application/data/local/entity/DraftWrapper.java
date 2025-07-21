package com.example.android_application.data.local.entity;

import androidx.annotation.NonNull;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class DraftWrapper {
    @SerializedName("mails")
    private List<Draft> drafts;

    @SerializedName("totalCount")
    private int totalCount;

    public List<Draft> getDrafts() {
        return drafts;
    }

    public void setDrafts(List<Draft> drafts) {
        this.drafts = drafts;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }

    @NonNull
    @Override
    public String toString() {
        return "DraftWrapper{" +
                "drafts=" + drafts +
                ", totalCount=" + totalCount +
                '}';
    }
}