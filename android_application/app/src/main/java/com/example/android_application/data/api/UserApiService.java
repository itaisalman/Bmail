package com.example.android_application.data.api;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.PUT;

public interface UserApiService {

    class ThemeUpdateRequest {
        private String theme;

        public ThemeUpdateRequest(String theme) {
            this.theme = theme;
        }

        public String getTheme() {
            return theme;
        }

        public void setTheme(String theme) {
            this.theme = theme;
        }
    }
    @GET("/api/users/")
    Call<ResponseBody> getUser(
            @Header("authorization") String authHeader
    );

    @PUT("/api/users/theme")
    Call<Void> updateUserTheme(
            @Header("authorization") String authHeader,
            @Body ThemeUpdateRequest themeUpdateRequest
    );
}
