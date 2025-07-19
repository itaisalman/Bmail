package com.example.android_application.ui.draft;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.android_application.R;
import com.example.android_application.data.local.entity.Draft;

import java.util.List;

public class DraftAdapter extends RecyclerView.Adapter<DraftAdapter.DraftViewHolder> {

    public interface OnDraftClickListener {
        void onClick(Draft draft);
        void onDelete(Draft draft);
    }

    private List<Draft> draftList;
    private final OnDraftClickListener listener;

    public DraftAdapter(List<Draft> draftList, OnDraftClickListener listener) {
        this.draftList = draftList;
        this.listener = listener;
    }

    public void setDraftList(List<Draft> newList) {
        this.draftList = newList;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public DraftViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_mail, parent, false);
        return new DraftViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull DraftViewHolder holder, int position) {
        Draft draft = draftList.get(position);

        // Show receiver instead of sender
        String receiver = draft.getTo();
        holder.receiver.setText(receiver != null && !receiver.trim().isEmpty() ? receiver : "Unknown Receiver");

        holder.title.setText(draft.getSubject() != null ? draft.getSubject() : "No Subject");
        holder.snippet.setText(draft.getBody() != null ? draft.getBody() : "No Content");
        holder.date.setText("");

        holder.itemView.setOnClickListener(v -> listener.onClick(draft));
//        holder.deleteBtn.setOnClickListener(v -> listener.onDelete(draft));
    }

    @Override
    public int getItemCount() {
        return draftList.size();
    }

    static class DraftViewHolder extends RecyclerView.ViewHolder {
        TextView receiver, title, snippet, date;
        ImageButton deleteBtn;

        public DraftViewHolder(@NonNull View itemView) {
            super(itemView);
            receiver = itemView.findViewById(R.id.mail_sender);
            title = itemView.findViewById(R.id.mail_title);
            snippet = itemView.findViewById(R.id.mail_snippet);
            date = itemView.findViewById(R.id.mail_date);
//            deleteBtn = itemView.findViewById(R.id.mail_delete_button); // Add this to your XML
        }
    }
}
