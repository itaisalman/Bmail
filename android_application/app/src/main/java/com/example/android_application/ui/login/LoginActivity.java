package com.example.android_application.ui.login;

import android.content.Intent;
import android.os.Bundle;
import android.text.InputType;
import android.widget.*;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.android_application.R;
import com.example.android_application.ui.home.HomeActivity;

public class LoginActivity extends AppCompatActivity {
    private EditText usernameEditText, passwordEditText;
    private TextView errorTextView;
    private LoginViewModel loginViewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        usernameEditText = findViewById(R.id.username_input);
        passwordEditText = findViewById(R.id.password_input);
        errorTextView = findViewById(R.id.error_text);
        CheckBox showPasswordCheckbox = findViewById(R.id.show_password_checkbox);
        Button loginButton = findViewById(R.id.login_button);
        TextView registerText = findViewById(R.id.register_text);

        loginViewModel = new ViewModelProvider(
                this, new LoginViewModel.Factory(getApplicationContext())
        ).get(LoginViewModel.class);

        showPasswordCheckbox.setOnCheckedChangeListener((buttonView, isChecked) -> {
            if (isChecked) {
                passwordEditText.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD);
            } else {
                passwordEditText.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
            }
            passwordEditText.setSelection(passwordEditText.getText().length());
        });

        registerText.setOnClickListener(v -> {
            Toast.makeText(this, "Registration not implemented yet", Toast.LENGTH_SHORT).show();
        });

        loginButton.setOnClickListener(v -> {
            errorTextView.setText("");

            String username = usernameEditText.getText().toString().trim();
            String password = passwordEditText.getText().toString().trim();

            if (username.isEmpty()) {
                usernameEditText.setError(getString(R.string.username_required));
                return;
            }

            if (password.isEmpty()) {
                passwordEditText.setError(getString(R.string.password_required));
                return;
            }

            loginViewModel.login(username, password,
                    token -> runOnUiThread(() -> {
                        Intent intent = new Intent(LoginActivity.this, HomeActivity.class);
                        startActivity(intent);
                        finish();
                    }),
                    error -> runOnUiThread(() -> errorTextView.setText(error))
            );
        });
    }
}
