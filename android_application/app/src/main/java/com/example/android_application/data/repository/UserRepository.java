package com.example.android_application.data.repository;

import com.example.android_application.data.api.UserApiService;

import org.json.JSONObject;
import androidx.annotation.NonNull;

import java.util.function.Consumer;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * Repository class responsible for handling user-related API calls.
 */
public class UserRepository {

    private final UserApiService api;

    /**
     * Initializes Retrofit and creates an instance of the API service.
     */
    public UserRepository() {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:3000/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        api = retrofit.create(UserApiService.class);
    }

    /**
     * Asynchronously fetches the user data from the backend using the given token.
     *
     * @param token     JWT token for authorization
     * @param onSuccess Callback invoked with user data on successful response
     * @param onError   Callback invoked with error message on failure
     */
    public void getUser(String token, Consumer<JSONObject> onSuccess, Consumer<String> onError) {
        // Prepare the API call with Bearer token
        Call<ResponseBody> call = api.getUser("Bearer " + token);

        // Enqueue the request asynchronously
        call.enqueue(new Callback<>() {

            /**
             * Called when the HTTP response is received successfully (status code 2xx or error).
             */
            @Override
            public void onResponse(@NonNull Call<ResponseBody> call, @NonNull Response<ResponseBody> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        // Parse the response body into a JSON object
                        String responseStr = response.body().string();
                        JSONObject json = new JSONObject(responseStr);
                        onSuccess.accept(json);
                    } catch (Exception e) {
                        onError.accept("Failed to parse user data.");
                    }
                } else {
                    // Handle error response
                    try (ResponseBody errorBody = response.errorBody()) {
                        if (errorBody != null) {
                            String errorJson = errorBody.string();
                            JSONObject json = new JSONObject(errorJson);
                            // Extract server-provided error message
                            String serverMessage = json.optString("error", "Unknown server error");
                            onError.accept(serverMessage);
                        } else {
                            onError.accept("Unknown server error");
                        }
                    } catch (Exception e) {
                        onError.accept("Unexpected server response.");
                    }
                }
            }

            /**
             * Called when the HTTP request fails (e.g., no network, timeout).
             */
            @Override
            public void onFailure(@NonNull Call<ResponseBody> call, @NonNull Throwable t) {
                onError.accept("Get user error: " + t.getMessage());
            }
        });
    }

}
