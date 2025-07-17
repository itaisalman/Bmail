package com.example.android_application.data.api;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Header;

public interface UserApiService {

    @GET("/api/users/")
    Call<ResponseBody> getUser(
            @Header("authorization") String authHeader
    );
}
