package com.example.android_application.data.api;

import com.example.android_application.data.local.entity.DraftWrapper;
import com.example.android_application.data.local.entity.Mail;
import com.example.android_application.data.local.entity.MailWrapper;
import java.util.List;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface MailApiService {

    @POST("/api/mails")
    Call<ResponseBody> sendMail(
            @Header("authorization") String authHeader,
            @Body MailRequest mailRequest
    );

    @POST("/api/mails/draft")
    Call<ResponseBody> saveDraft(
            @Header("authorization") String authHeader,
            @Body MailRequest mailRequest
    );

    // Changed return type to List<MailWrapper> since server returns JSON array at root
    @GET("/api/mails/search/{query}")
    Call<List<MailWrapper>> searchMails(
            @Header("authorization") String authHeader,
            @Path("query") String query
    );

    @GET("/api/mails")
    Call<DraftWrapper> getDrafts(
            @Header("authorization") String bearerToken,
            @Header("label") String label,  // pass "Draft" here
            @Query("page") int page
    );

    @GET("labels/{labelId}/mails")
    Call<List<Mail>> getMailsByLabel(@Header("Authorization") String token, @Path("labelId") String labelId);

}
