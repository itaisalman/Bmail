package com.example.android_application.data.repository;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import org.json.JSONObject;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.Executors;
import java.util.function.Consumer;

public class AuthRepository {
    private final Context context;

    public AuthRepository(Context context) {
        this.context = context.getApplicationContext();
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

                    Log.d("JWT", "Token saved: " + token);
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
}
