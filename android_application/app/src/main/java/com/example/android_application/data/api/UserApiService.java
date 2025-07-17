package com.example.android_application.data.api;
import com.example.android_application.data.api.model.User;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Header;


public interface UserApiService {
    @GET("/api/users")
    Call<User> getUserById(
            @Header("authorization") String authHeader,
            @Header("user") String userId
    );

}
