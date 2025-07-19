package com.example.android_application.data.repository;

import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;

import androidx.annotation.NonNull;

import com.example.android_application.data.api.UserApiService;

import org.jetbrains.annotations.NotNull;
import org.json.JSONObject;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.Executors;
import java.util.function.Consumer;

public class AuthRepository {
    private final Context context;
    private final UserApiService api;

    public AuthRepository(Context context) {
        this.context = context.getApplicationContext();
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:3000/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        api = retrofit.create(UserApiService.class);
    }

    public void login(String username, String password,
                      Consumer<String> onSuccess,
                      Consumer<String> onError) {

        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                URL url = new URL("http://10.0.2.2:3000/api/tokens");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);

                JSONObject payload = new JSONObject();
                payload.put("username", username);
                payload.put("password", password);

                OutputStream os = conn.getOutputStream();
                os.write(payload.toString().getBytes());
                os.flush();
                os.close();

                int responseCode = conn.getResponseCode();
                InputStream is = (responseCode == 200) ? conn.getInputStream() : conn.getErrorStream();
                BufferedReader reader = new BufferedReader(new InputStreamReader(is));
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();

                if (responseCode == 200) {
                    JSONObject json = new JSONObject(response.toString());
                    String token = json.getString("token");

                    // Save token to SharedPreferences
                    SharedPreferences prefs = context.getSharedPreferences("auth", Context.MODE_PRIVATE);
                    prefs.edit().putString("jwt", token).apply();

                    onSuccess.accept(token);
                } else {
                    JSONObject errorJson = new JSONObject(response.toString());
                    String msg = errorJson.optString("error", "Login failed");
                    onError.accept(msg);
                }

            } catch (Exception e) {
                onError.accept("Server error: " + e.getMessage());
            }
        });
    }

    public void signup(String firstName, String lastName, String username, String password,
                       String birthDate, String gender, Uri imageUri,
                       Context context,
                       Consumer<String> onSuccess, Consumer<String> onError) {

        OkHttpClient client = new OkHttpClient();

        MultipartBody.Builder multipartBuilder = new MultipartBody.Builder().setType(MultipartBody.FORM)
                .addFormDataPart("first_name", firstName)
                .addFormDataPart("last_name", lastName)
                .addFormDataPart("username", username)
                .addFormDataPart("password", password)
                .addFormDataPart("birth_date", birthDate)
                .addFormDataPart("gender", gender);

        if (imageUri != null) {
            try {
                InputStream inputStream = context.getContentResolver().openInputStream(imageUri);
                if (inputStream != null) {
                    byte[] imageBytes = getBytesFromInputStream(inputStream);
                    inputStream.close();
                    multipartBuilder.addFormDataPart(
                            "image", "profile.jpg",
                            RequestBody.create(imageBytes, MediaType.parse("image/jpeg"))
                    );
                } else {
                onError.accept("Error: Unable to open image stream");
                return;
                }
            } catch (IOException e) {
                onError.accept("Failed to read image: " + e.getMessage());
                return;
            }
        }

        RequestBody requestBody = multipartBuilder.build();

        Request request = new Request.Builder()
                .url("http://10.0.2.2:3000/api/users")
                .post(requestBody)
                .build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(@NotNull Call call, @NotNull IOException e) {
                onError.accept("Error: " + e.getMessage());
            }

            @Override
            public void onResponse(@NotNull Call call, @NotNull Response response) throws IOException {
                if (response.code() == 201) {
                    onSuccess.accept("success");
                } else if (response.code() == 409) {
                    onError.accept("username_exists");
                } else {
                    ResponseBody body = response.body();
                    if (body != null) {
                        onError.accept("Signup failed: " + body.string());
                    } else {
                        onError.accept("Signup failed: empty response body");
                    }

                }
            }
        });
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
        retrofit2.Call<ResponseBody> call = api.getUser("Bearer " + token);

        // Enqueue the request asynchronously
        call.enqueue(new retrofit2.Callback<>() {

            /**
             * Called when the HTTP response is received successfully (status code 2xx or error).
             */
            @Override
            public void onResponse(@NonNull retrofit2.Call<ResponseBody> call, @NonNull retrofit2.Response<ResponseBody> response) {
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
            public void onFailure(@NonNull retrofit2.Call<ResponseBody> call, @NonNull Throwable t) {
                onError.accept("Get user error: " + t.getMessage());
            }
        });
    }

    private byte[] getBytesFromInputStream(InputStream inputStream) throws IOException {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        int nRead;
        byte[] data = new byte[4096];
        while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
            buffer.write(data, 0, nRead);
        }
        return buffer.toByteArray();
    }
}
