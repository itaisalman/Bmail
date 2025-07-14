package com.example.android_application;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;

public class SignupActivity extends AppCompatActivity {
    EditText firstName, lastName, username, password, confirmPassword;
     DatePicker birthDate;
     RadioGroup genderGroup;
     Button uploadBtn, signupBtn;
     Uri imageUri;
    private ActivityResultLauncher<Intent> imagePickerLauncher;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.signup_activity);

        firstName = findViewById(R.id.firstName);
        lastName = findViewById(R.id.lastName);
        birthDate = findViewById(R.id.birthDateSpinner);
        genderGroup = findViewById(R.id.genderGroup);
        username = findViewById(R.id.username);
        password = findViewById(R.id.password);
        confirmPassword = findViewById(R.id.confirmPassword);
        uploadBtn = findViewById(R.id.uploadProfileImage);
        signupBtn = findViewById(R.id.signupBtn);

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

}
