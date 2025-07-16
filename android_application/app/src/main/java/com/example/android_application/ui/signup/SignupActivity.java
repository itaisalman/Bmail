package com.example.android_application.ui.signup;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.text.InputType;
import android.widget.*;
import androidx.activity.EdgeToEdge;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.lifecycle.ViewModelProvider;
import android.view.View;
import com.example.android_application.R;
import com.example.android_application.ui.login.LoginActivity;

import java.util.Locale;

public class SignupActivity extends AppCompatActivity {
    EditText firstName, lastName, username, password, confirmPassword;
    DatePicker birthDate;
    RadioGroup genderGroup;
    Button uploadBtn, signupBtn;
    private TextView errorTextView;
    private ActivityResultLauncher<Intent> imagePickerLauncher;
    private ImageView imagePreview;
    private Uri imageUri;

    private SignupViewModel viewModel;

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

        viewModel = new ViewModelProvider(this, new SignupViewModel.Factory(this)).get(SignupViewModel.class);
        viewModel.getErrorMessage().observe(this, msg -> {
            if (msg != null) {
                errorTextView.setText(msg);
            }
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
        imagePreview  = findViewById(R.id.profileImageView);

        CheckBox showPasswordCheckbox = findViewById(R.id.show_password_checkbox);
        showPasswordCheckbox.setOnCheckedChangeListener((buttonView, isChecked) -> {
            int inputType = isChecked
                    ? InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD
                    : InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD;

            password.setInputType(inputType);
            confirmPassword.setInputType(inputType);

            password.setSelection(password.getText().length());
            confirmPassword.setSelection(confirmPassword.getText().length());
        });

        imagePickerLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                        imageUri = result.getData().getData();
                        imagePreview.setImageURI(imageUri);
                        imagePreview.setVisibility(View.VISIBLE);
                    }
                });

        uploadBtn.setOnClickListener(v -> openImagePicker());
        signupBtn.setOnClickListener(v -> handleSignup());
    }

    private void openImagePicker() {
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType("image/*");
        imagePickerLauncher.launch(Intent.createChooser(intent, "Select Profile Image"));
    }

    private void handleSignup() {
        String fName = firstName.getText().toString().trim();
        String lName = lastName.getText().toString().trim();
        String uname = username.getText().toString().trim();
        String pass = password.getText().toString();
        String confirmPassStr = confirmPassword.getText().toString();

        int day = birthDate.getDayOfMonth();
        int month = birthDate.getMonth();
        int year = birthDate.getYear();
        String birthDateFormatted = String.format(Locale.US, "%02d/%02d/%04d", month + 1, day, year);

        int selectedGenderId = genderGroup.getCheckedRadioButtonId();
        String selectedGender = "";
        if (selectedGenderId != -1) {
            RadioButton selectedGenderBtn = findViewById(selectedGenderId);
            selectedGender = selectedGenderBtn.getText().toString();
        }

        if (fName.isEmpty() || lName.isEmpty() || uname.isEmpty() || pass.isEmpty() || confirmPassStr.isEmpty() || selectedGender.isEmpty()) {
            viewModel.setError(getString(R.string.error_fill_all_fields));
            return;
        }

        if (!pass.equals(confirmPassStr)) {
            viewModel.setError(getString(R.string.error_password_match));
            return;
        }

        String imagePath = imageUri != null ? imageUri.toString() : null;

        viewModel.signup(
                fName, lName, uname, pass,
                birthDateFormatted, selectedGender, imagePath,
                result -> runOnUiThread(() -> {
                    if ("success".equals(result)) {
                        Intent intent = new Intent(SignupActivity.this, LoginActivity.class);
                        startActivity(intent);
                        finish();
                    }
                }),
                errorMsg -> runOnUiThread(() -> {
                    if ("username_exists".equals(errorMsg)) {
                        viewModel.setError(getString(R.string.error_username_exists));
                    } else {
                        viewModel.setError(errorMsg);
                    }
                })
        );
    }
}
