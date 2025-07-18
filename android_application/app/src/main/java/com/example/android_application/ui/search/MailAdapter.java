package com.example.android_application.ui.search;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import com.example.android_application.R;
import com.example.android_application.data.local.entity.Mail;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

public class MailAdapter extends RecyclerView.Adapter<MailAdapter.MailViewHolder> {

    private List<Mail> mailList = new ArrayList<>();
    private OnItemClickListener listener;
    private Context context;

    public interface OnItemClickListener {
        void onItemClick(Mail mail);
    }

    public void setOnItemClickListener(OnItemClickListener listener) {
        this.listener = listener;
    }

    public void setMailList(List<Mail> newList) {
        this.mailList = newList != null ? newList : new ArrayList<>();
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public MailViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_mail, parent, false);
        return new MailViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MailViewHolder holder, int position) {
        Mail mail = mailList.get(position);

        Context context = holder.itemView.getContext();
        // Setting the properties that will get rendered on the screen.
        String sender = mail.getSenderAddress();
        holder.sender.setText(
                (sender != null && !sender.trim().isEmpty()) ? sender : context.getString(R.string.unknown_sender)
        );
        String title = mail.getTitle();
        holder.title.setText(
                (title != null && !title.trim().isEmpty()) ? title : context.getString(R.string.no_subject)
        );
        String content = mail.getContent();
        if (content == null || content.trim().isEmpty()) {
            holder.snippet.setText(R.string.no_content_message);
        } else {
            holder.snippet.setText(content.trim());
        }
        holder.date.setText(formatDate(mail.getDate()));

        // Set click listener to forward the clicked mail
        holder.itemView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onItemClick(mail);
            }
        });
    }

    @Override
    public int getItemCount() {
        return mailList.size();
    }

    static class MailViewHolder extends RecyclerView.ViewHolder {
        TextView sender, title, snippet, date;

        public MailViewHolder(@NonNull View itemView) {
            super(itemView);
            sender = itemView.findViewById(R.id.mail_sender);
            title = itemView.findViewById(R.id.mail_title);
            snippet = itemView.findViewById(R.id.mail_snippet);
            date = itemView.findViewById(R.id.mail_date);
        }
    }

    // Helper method to format date to "MMM dd"
    private String formatDate(String rawDate) {
        if (rawDate == null || rawDate.isEmpty()) return "";
        try {
            SimpleDateFormat isoFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault());
            Date date = isoFormat.parse(rawDate);
            SimpleDateFormat displayFormat = new SimpleDateFormat("MMM dd", Locale.getDefault());
            return date != null ? displayFormat.format(date) : rawDate;
        } catch (Exception e) {
            return rawDate;
        }
    }
}
