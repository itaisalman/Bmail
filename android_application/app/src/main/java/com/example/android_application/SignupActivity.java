package com.example.android_application;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.text.InputType;
import android.widget.*;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import org.json.JSONObject;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.*;
import java.util.Locale;

public class SignupActivity extends AppCompatActivity {
    EditText firstName, lastName, username, password, confirmPassword;
     DatePicker birthDate;
     RadioGroup genderGroup;
     Button uploadBtn, signupBtn;
     Uri imageUri;
    private ActivityResultLauncher<Intent> imagePickerLauncher;
    private TextView errorTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_signup);
      
      ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });


        firstName = findViewById(R.id.firstName);
        lastName = findViewById(R.id.lastName);
        birthDate = findViewById(R.id.birthDateSpinner);
        genderGroup = findViewById(R.id.genderGroup);
        username = findViewById(R.id.username);
        password = findViewById(R.id.password);
        confirmPassword = findViewById(R.id.confirmPassword);
        uploadBtn = findViewById(R.id.uploadProfileImage);
        signupBtn = findViewById(R.id.signupBtn);
        errorTextView = findViewById(R.id.error_text);
        CheckBox showPasswordCheckbox = findViewById(R.id.show_password_checkbox);

        showPasswordCheckbox.setOnCheckedChangeListener((buttonView, isChecked) -> {
            if (isChecked) {
                password.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD);
                confirmPassword.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD);
            } else {
                password.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
                confirmPassword.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
            }
            password.setSelection(password.getText().length());
            confirmPassword.setSelection(confirmPassword.getText().length());
        });


        signupBtn.setOnClickListener(v -> handleSignup());

        imagePickerLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                        imageUri = result.getData().getData();
                    }
                });

        uploadBtn.setOnClickListener(v -> openImagePicker());
    }

    private void openImagePicker() {
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType("image/*");
        imagePickerLauncher.launch(
                Intent.createChooser(intent, "Select Profile Image")
        );
    }

    private void handleSignup() {
        String fName = firstName.getText().toString().trim();
        String lName = lastName.getText().toString().trim();
        String uname = username.getText().toString().trim();
        String pass = password.getText().toString();
        String confirmPass = confirmPassword.getText().toString();

        // Birth date format
        int day = birthDate.getDayOfMonth();
        int month = birthDate.getMonth();
        int year = birthDate.getYear();

        String birthDateStr = String.format(Locale.US, "%02d/%02d/%04d",  month + 1, day, year);

        // Gender format
        int selectedGenderId = genderGroup.getCheckedRadioButtonId();
        String gender = "";
        if (selectedGenderId != -1) {
            RadioButton selectedGender = findViewById(selectedGenderId);
            gender = selectedGender.getText().toString();
        } final String genderFinal = gender;

        errorTextView.setText("");

        if (fName.isEmpty() || lName.isEmpty() || uname.isEmpty() || pass.isEmpty()
                || confirmPass.isEmpty() || gender.isEmpty()) {
            errorTextView.setText(getString(R.string.error_fill_all_fields));
            return;
        }

        if (!pass.equals(confirmPass)) {
            errorTextView.setText(getString(R.string.error_password_match));
            return;
        }

        new Thread(() -> {
            try {
                URL url = new URL("http://10.0.2.2:3000/api/users");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);

                JSONObject payload = new JSONObject();
                payload.put("first_name", fName);
                payload.put("last_name", lName);
                payload.put("birth_date", birthDateStr);
                payload.put("gender", genderFinal);
                payload.put("username", uname);
                payload.put("password", pass);
                if (imageUri != null) {
                    payload.put("profile_image_uri", imageUri.toString());
                }

                OutputStream os = conn.getOutputStream();
                os.write(payload.toString().getBytes());
                os.flush();
                os.close();

                // Reads the response code from the server
                int responseCode = conn.getResponseCode();
                // Opens an InputStream from the server
                InputStream is = (responseCode == 201)
                        ? conn.getInputStream()
                        : conn.getErrorStream();
                BufferedReader reader = new BufferedReader(new InputStreamReader(is));
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();

                // Saves the response as a string for later use.
                String responseBody = response.toString();

                // If registration is successful, go to the login screen
                if (responseCode == 201) {
                    runOnUiThread(() -> {
                        Intent intent = new Intent(SignupActivity.this, LoginActivity.class);
                        startActivity(intent);
                        finish();
                    });
                }
                //If the username already exists, displays a message to the user
                else if (responseCode == 409) {
                    runOnUiThread(() ->
                            errorTextView.setText(getString(R.string.error_username_exists))
                    );
                }
                else {
                    String fullError = getString(R.string.error_registration_failed) + "\n" + responseBody;
                    runOnUiThread(() ->
                            errorTextView.setText(fullError)
                    );
                }

            } catch (Exception e) {
                runOnUiThread(() ->
                        errorTextView.setText(e.getMessage()));
            }
        }).start();
    }

    }



