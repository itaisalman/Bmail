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
        passwordEditText = findViewById(R.id.password_input);
        CheckBox showPasswordCheckbox = findViewById(R.id.show_password_checkbox);

        // Show password if show button is on.
        showPasswordCheckbox.setOnCheckedChangeListener((buttonView, isChecked) -> {
            if (isChecked)
                passwordEditText.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD);
            else
                passwordEditText.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
            passwordEditText.setSelection(passwordEditText.getText().length()); // keep cursor at end
        });
    }
}

