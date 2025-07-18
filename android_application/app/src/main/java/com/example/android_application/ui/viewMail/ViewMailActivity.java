package com.example.android_application.ui.viewMail;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.*;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import com.example.android_application.R;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

    public class ViewMailActivity extends AppCompatActivity {

        private TextView subjectTextView, fromTextView, dateTextView, bodyTextView;
        private boolean isStarred = false;
        private boolean isImportant = false;


        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_view_mail);

            subjectTextView = findViewById(R.id.subjectTextView);
            fromTextView = findViewById(R.id.fromEmail);
            dateTextView = findViewById(R.id.dateTextView);
            bodyTextView = findViewById(R.id.bodyTextView);
            ImageButton closeButton = findViewById(R.id.closeButton);

            closeButton.setOnClickListener(v -> finish());

            ViewMailViewModel viewModel = new ViewModelProvider(this).get(ViewMailViewModel.class);

            String mailId = getIntent().getStringExtra("mail_id");
            String token = getIntent().getStringExtra("token");

            if (mailId != null && token != null) {
                viewModel.loadMail(token, mailId);
            }

            ImageButton starButton = findViewById(R.id.starButton);
            ImageButton importantButton = findViewById(R.id.importantButton);

            SharedPreferences prefs = getSharedPreferences("MailPrefs", MODE_PRIVATE);
            isStarred = prefs.getBoolean("isStarred_" + mailId, false);
            isImportant = prefs.getBoolean("isImportant_" + mailId, false);

            // Update the button image according to the status
            starButton.setImageResource(isStarred ? R.drawable.ic_star : R.drawable.ic_star_view_mail);
            importantButton.setImageResource(isImportant ? R.drawable.ic_important : R.drawable.ic_important_view_mail);

            starButton.setOnClickListener(v -> {
                isStarred = !isStarred;
                starButton.setImageResource(isStarred ? R.drawable.ic_star : R.drawable.ic_star_view_mail);
                prefs.edit().putBoolean("isStarred_" + mailId, isStarred).apply();
            });

            importantButton.setOnClickListener(v -> {
                isImportant = !isImportant;
                importantButton.setImageResource(isImportant ? R.drawable.ic_important : R.drawable.ic_important_view_mail);
                prefs.edit().putBoolean("isImportant_" + mailId, isImportant).apply();
            });


        // Listens for changes in the email and updates the view
        viewModel.getMail().observe(this, mail -> {
            if (mail != null) {
                subjectTextView.setText(mail.getTitle());
                fromTextView.setText(mail.getSenderAddress());

                try {
                    SimpleDateFormat parser = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault());
                    parser.setTimeZone(TimeZone.getTimeZone("UTC"));

                    Date parsedDate = parser.parse(mail.getDate());

                    if (parsedDate != null) {
                        SimpleDateFormat displayFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.getDefault());
                        displayFormat.setTimeZone(TimeZone.getTimeZone("Asia/Jerusalem"));
                        dateTextView.setText(displayFormat.format(parsedDate));
                    } else {
                        dateTextView.setText(mail.getDate());
                    }
                } catch (Exception e) {
                    dateTextView.setText(mail.getDate());
                }

                // Display the email body
                bodyTextView.setText(mail.getContent());
            }
        });

        // Display an error using Toast if an error message is received from the ViewModel
        viewModel.getErrorMessage().observe(this, error -> {
            if (error != null) {
                Toast.makeText(this, error, Toast.LENGTH_LONG).show();
            }
        });
    }

    @Override
    protected void onSaveInstanceState(@NonNull Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putBoolean("isStarred", isStarred);
        outState.putBoolean("isImportant", isImportant);
    }

}