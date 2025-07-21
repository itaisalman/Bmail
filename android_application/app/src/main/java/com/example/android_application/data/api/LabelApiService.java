package com.example.android_application.data.api;

import com.example.android_application.data.local.entity.Label;

import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.HTTP;
import retrofit2.http.Header;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface LabelApiService {

    @GET("/api/labels")
    Call<List<Label>> getAllUserLabels(@Header("authorization") String authHeader);

    @POST("/api/labels")
    Call<Label> createLabel(
            @Header("authorization") String authHeader,
            @Body Map<String, String> labelData
    );
    @PATCH("/api/labels/{id}")
    Call<Void> updateLabel(
            @Header("authorization") String authHeader,
            @Path("id") String labelId,
            @Body Map<String, String> labelData
    );

    @DELETE("/api/labels/{id}")
    Call<Void> deleteLabel(
            @Header("authorization") String authHeader,
            @Path("id") String labelId
    );

    @PATCH("labels/{mail_id}/assign-label")
    Call<Void> assignLabelToMail(
            @Header("authorization") String token,
            @Path("mail_id") String mailId,
            @Body Map<String, String> body
    );

    @HTTP(method = "DELETE", path = "labels/mail/{mailId}", hasBody = true)
    Call<Void> removeLabelFromMail(
            @Header("authorization") String token,
            @Path("mailId") String mailId,
            @Body Map<String, String> body
    );
}