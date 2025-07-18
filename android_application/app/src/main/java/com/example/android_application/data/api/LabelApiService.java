package com.example.android_application.data.api;

import com.example.android_application.data.local.entity.Label;
import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;

public interface LabelApiService {

    @GET("/api/labels")
    Call<List<Label>> getAllUserLabels(@Header("authorization") String authHeader);

    @POST("/api/labels")
    Call<Label> createLabel(
            @Header("authorization") String authHeader,
            @Body Map<String, String> labelData
    );
}
