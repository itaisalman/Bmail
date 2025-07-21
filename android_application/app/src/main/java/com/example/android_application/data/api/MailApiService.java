package com.example.android_application.data.api;

import com.example.android_application.data.local.entity.MailPageResponse;
import com.example.android_application.data.local.entity.DraftWrapper;
import com.example.android_application.data.local.entity.MailWrapper;
import java.util.List;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface MailApiService {

    @POST("/api/mails")
    Call<ResponseBody> sendMail(
            @Header("authorization") String authHeader,
            @Body MailRequest mailRequest
    );

    @GET("/api/mails")
    Call<MailPageResponse> getMails(
            @Header("authorization") String authHeader,
            @Header("label") String label,
            @Query("page") int page
    );

    @POST("/api/mails/draft")
    Call<ResponseBody> saveDraft(
            @Header("authorization") String authHeader,
            @Body MailRequest mailRequest
    );

    @GET("/api/mails/search/{query}")
    Call<List<MailWrapper>> searchMails(
            @Header("authorization") String authHeader,
            @Path("query") String query
    );

    @GET("/api/mails")
    Call<DraftWrapper> getDrafts(
            @Header("authorization") String bearerToken,
            @Header("label") String label,
            @Query("page") int page
    );

    @PATCH("api/mails/{id}")
    Call<ResponseBody> updateDraft(
            @Header("Authorization") String authToken,
            @Path("id") String draftId,
            @Body MailRequest request
    );

    @DELETE("/api/mails/draft/{id}")
    Call<ResponseBody> deleteDraft(
            @Header("authorization") String authHeader,
            @Path("id") String draftId
    );

}
