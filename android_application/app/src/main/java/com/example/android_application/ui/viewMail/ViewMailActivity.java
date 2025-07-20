package com.example.android_application.ui.viewMail;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.*;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import com.example.android_application.R;
import com.example.android_application.data.local.entity.Mail;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

    public class ViewMailActivity extends AppCompatActivity {
        private boolean isStarred = false;
        private boolean isImportant = false;


        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_view_mail);

            // Retrieve the display elements
            TextView subjectTextView = findViewById(R.id.subjectTextView);
            TextView fromTextView = findViewById(R.id.fromEmail);
            TextView dateTextView = findViewById(R.id.dateTextView);
            TextView bodyTextView = findViewById(R.id.bodyTextView);
            ImageButton closeButton = findViewById(R.id.closeButton);
            ImageButton starButton = findViewById(R.id.starButton);
            ImageButton importantButton = findViewById(R.id.importantButton);

            // Listens for the screen to close
            closeButton.setOnClickListener(v -> finish());

            // Receiving the sent email
            Mail mail = (Mail) getIntent().getSerializableExtra("mail");

            TextView fromLabel = findViewById(R.id.fromLabel);

            String mailBox = getIntent().getStringExtra("mail_box");

            if (mail == null) {
                Toast.makeText(this, "Error: The email was not received", Toast.LENGTH_LONG).show();
                finish();
                return;
            }

            // Change title according to the box
            if ("sent".equals(mailBox)) {
                fromLabel.setText(getString(R.string.to));
                fromTextView.setText(mail.getReceiverAddress());
            } else {
                fromLabel.setText(getString(R.string.from));
                fromTextView.setText(mail.getSenderAddress());
            }

            // Display the email details
            subjectTextView.setText(mail.getTitle());
//            fromTextView.setText(mail.getSenderAddress());
            bodyTextView.setText(mail.getContent());

            try {
                SimpleDateFormat parser = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault());
                parser.setTimeZone(TimeZone.getTimeZone("UTC"));

                Date parsedDate = parser.parse(mail.getDate());

                if (parsedDate != null) {
                    // Convert the date to a readable format in the local display
                    SimpleDateFormat displayFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.getDefault());
                    displayFormat.setTimeZone(TimeZone.getTimeZone("Asia/Jerusalem"));
                    dateTextView.setText(displayFormat.format(parsedDate));
                } else {
                    dateTextView.setText(mail.getDate());
                }
            } catch (Exception e) {
                dateTextView.setText(mail.getDate());
            }

            // Handling Favorite and Important buttons
            String mailId = mail.getId();

            // Using SharedPreferences to save locally if the email is starred/important
            SharedPreferences prefs = getSharedPreferences("MailPrefs", MODE_PRIVATE);
            isStarred = prefs.getBoolean("isStarred_" + mailId, false);
            isImportant = prefs.getBoolean("isImportant_" + mailId, false);

            // Update the icons according to the saved state
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

        }

    @Override
    // Save the star and important state before screen rotation
    protected void onSaveInstanceState(@NonNull Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putBoolean("isStarred", isStarred);
        outState.putBoolean("isImportant", isImportant);
    }

}