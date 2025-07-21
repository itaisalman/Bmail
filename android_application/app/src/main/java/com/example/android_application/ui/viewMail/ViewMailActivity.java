package com.example.android_application.ui.viewMail;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.annotation.NonNull;
import com.example.android_application.R;
import com.example.android_application.data.local.entity.Mail;
import com.example.android_application.ui.label.LabelDialogHelper;
import com.example.android_application.ui.label.LabelMailsViewModel;
import com.example.android_application.ui.label.LabelViewModel;
import androidx.lifecycle.ViewModelProvider;
import com.example.android_application.ui.BaseThemedActivity;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

public class ViewMailActivity extends BaseThemedActivity {
    private ViewMailViewModel viewModel;
    private String mailBox;
    private LabelViewModel labelViewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_view_mail);
        labelViewModel = new ViewModelProvider(this).get(LabelViewModel.class);
        SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
        String currentUserEmail = prefs.getString("email", "");
        String labelName = getIntent().getStringExtra("labelName");
        LabelMailsViewModel.Factory factory = new LabelMailsViewModel.Factory(
                getApplication(),
                currentUserEmail, labelName
        );

        LabelMailsViewModel labelMailsViewModel = new ViewModelProvider(this, factory).get(LabelMailsViewModel.class);

        viewModel = new ViewModelProvider(this, new ViewModelProvider.AndroidViewModelFactory(getApplication()))
            .get(ViewMailViewModel.class);

        TextView subjectTextView = findViewById(R.id.subjectTextView);
        TextView fromTextView = findViewById(R.id.fromEmail);
        TextView dateTextView = findViewById(R.id.dateTextView);
        TextView bodyTextView = findViewById(R.id.bodyTextView);
        TextView fromLabel = findViewById(R.id.fromLabel);
        ImageButton closeButton = findViewById(R.id.closeButton);
        ImageButton starButton = findViewById(R.id.starButton);
        ImageButton importantButton = findViewById(R.id.importantButton);
        ImageButton labelAssignButton = findViewById(R.id.labelButton);

        mailBox = getIntent().getStringExtra("mail_box");

        // Observe ViewModel
        viewModel.getIsStarred().observe(this, isStarred -> {
            starButton.setImageResource(isStarred ? R.drawable.ic_star : R.drawable.ic_star_view_mail);
        });

        viewModel.getIsImportant().observe(this, isImportant -> {
            importantButton.setImageResource(isImportant ? R.drawable.ic_important : R.drawable.ic_important_view_mail);
        });

        starButton.setOnClickListener(v -> viewModel.toggleStarred());
        importantButton.setOnClickListener(v -> viewModel.toggleImportant());
        closeButton.setOnClickListener(v -> finish());

        String mailId = getIntent().getStringExtra("mail_id");
        // Receiving the sent email

        if (mailId == null || mailId.isEmpty()) {
            Toast.makeText(this, "Error: Email ID not received", Toast.LENGTH_LONG).show();
            finish();
            return;
        }

        viewModel.loadMailById(mailId).observe(this, mail -> {
            if (mail == null) {
                Toast.makeText(this, "Error: Email not found", Toast.LENGTH_LONG).show();
                finish();
                return;
            }

            viewModel.setMail(mail);

            subjectTextView.setText(mail.getTitle());
            bodyTextView.setText(mail.getContent());

            if ("sent".equals(mailBox)) {
                fromLabel.setText(getString(R.string.to));
                fromTextView.setText(mail.getReceiverAddress());
            } else {
                fromLabel.setText(getString(R.string.from));
                fromTextView.setText(mail.getSenderAddress());
            }

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
            String token = prefs.getString("jwt", "");
            labelViewModel.fetchLabels();
            labelAssignButton.setOnClickListener(v ->
                    LabelDialogHelper.showLabelAssignmentDialog(
                            this,
                            mail,
                            labelViewModel,
                            labelMailsViewModel,
                            token,
                            this,
                            null
                    )
            );
        });
    }
}

