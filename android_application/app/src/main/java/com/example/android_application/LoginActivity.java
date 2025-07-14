package com.example.android_application;

import android.content.Intent;
import android.os.Bundle;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import android.text.InputType;

import org.json.JSONObject;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import android.util.Log;
import java.io.*;

public class LoginActivity extends AppCompatActivity {
    private EditText usernameEditText, passwordEditText;
    private TextView errorTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        usernameEditText = findViewById(R.id.username_input);
        passwordEditText = findViewById(R.id.password_input);
        CheckBox showPasswordCheckbox = findViewById(R.id.show_password_checkbox);
        errorTextView = findViewById(R.id.error_text);
        Button loginButton = findViewById(R.id.login_button);

        TextView registerText = findViewById(R.id.register_text);
        registerText.setOnClickListener(v -> {
            Intent intent = new Intent(LoginActivity.this, SignupActivity.class);
            startActivity(intent);
        });

        showPasswordCheckbox.setOnCheckedChangeListener((buttonView, isChecked) -> {
            if (isChecked)
                // Combine class and variation for visible password
                passwordEditText.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD);
            else
                passwordEditText.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
            passwordEditText.setSelection(passwordEditText.getText().length()); // keep cursor at end
        });

        loginButton.setOnClickListener(v -> handleLogin());
    }

    private void handleLogin() {
        String username = usernameEditText.getText().toString().trim();
        String password = passwordEditText.getText().toString().trim();

        // Clear previous error
        errorTextView.setText("");

        if (username.isEmpty()) {
            usernameEditText.setError(getString(R.string.username_required));
            return;
        }
        if (password.isEmpty()) {
            passwordEditText.setError(getString(R.string.password_required));
            return;
        }
        new Thread(() -> {
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

                // ✅ Read the response body (whether success or error)
                InputStream is = (responseCode == 200) ? conn.getInputStream() : conn.getErrorStream();
                BufferedReader reader = new BufferedReader(new InputStreamReader(is));
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();

                String responseBody = response.toString();

                // ✅ Parse token if status is OK
                if (responseCode == 200) {
                    try {
                        JSONObject json = new JSONObject(responseBody);
                        String token = json.getString("token");

                        // ✅ Print token to Logcat
                        Log.d("JWT", "Token: " + token);

                        runOnUiThread(() -> {
                            // Save token to SharedPreferences
                            getSharedPreferences("auth", MODE_PRIVATE)
                                    .edit()
                                    .putString("jwt", token)
                                    .apply();

                            // For now - Navigate to main screen if login was successful
                            Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                            startActivity(intent);
                            finish();
                        });
                    } catch (Exception parseErr) {
                        runOnUiThread(() -> errorTextView.setText("Parse error: " + parseErr.getMessage()));
                    }

                } else {
                    try {
                        JSONObject errorJson = new JSONObject(responseBody);
                        String errorMessage = errorJson.optString("error", getString(R.string.login_failed));
                        runOnUiThread(() -> errorTextView.setText(errorMessage));
                    } catch (Exception parseError) {
                        runOnUiThread(() -> errorTextView.setText(getString(R.string.login_failed)));
                    }
                }

            } catch (Exception e) {
                runOnUiThread(() -> errorTextView.setText(getString(R.string.server_error_with_message, e.getMessage())));
            }
        }).start();
    }
}
