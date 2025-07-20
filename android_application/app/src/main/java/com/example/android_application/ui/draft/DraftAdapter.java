package com.example.android_application.ui.draft;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.DiffUtil;
import androidx.recyclerview.widget.RecyclerView;
import com.example.android_application.R;
import com.example.android_application.data.local.entity.Draft;
import java.util.ArrayList;
import java.util.List;

public class DraftAdapter extends RecyclerView.Adapter<DraftAdapter.DraftViewHolder> {

    // Listener interface for item click and delete actions.
    public interface OnDraftClickListener {
        void onClick(Draft draft);
        void onDelete(Draft draft);
    }

    private List<Draft> draftList = new ArrayList<>();
    private final OnDraftClickListener listener;

    public DraftAdapter(List<Draft> draftList, OnDraftClickListener listener) {
        if (draftList != null) {
            this.draftList = draftList;
        }
        this.listener = listener;
    }

    // Efficiently update the list using DiffUtil for minimal UI changes.
    public void setDraftList(List<Draft> newList) {
        DiffUtil.DiffResult diffResult = DiffUtil.calculateDiff(new DiffCallback(this.draftList, newList));
        this.draftList.clear();
        if (newList != null) {
            this.draftList.addAll(newList);
        }
        diffResult.dispatchUpdatesTo(this);
    }

    @NonNull
    @Override
    public DraftViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_draft, parent, false);
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
        holder.itemView.setOnClickListener(v -> listener.onClick(draft));

        // Delete button click
        holder.deleteBtn.setVisibility(View.VISIBLE);
        holder.deleteBtn.setOnClickListener(v -> listener.onDelete(draft));
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
            receiver = itemView.findViewById(R.id.draft_receiver);
            title = itemView.findViewById(R.id.draft_title);
            snippet = itemView.findViewById(R.id.draft_snippet);
            date = itemView.findViewById(R.id.draft_date);
            deleteBtn = itemView.findViewById(R.id.deleteButton);
        }
    }

    private static class DiffCallback extends DiffUtil.Callback {

        private final List<Draft> oldList;
        private final List<Draft> newList;

        public DiffCallback(List<Draft> oldList, List<Draft> newList) {
            this.oldList = oldList != null ? oldList : new ArrayList<>();
            this.newList = newList != null ? newList : new ArrayList<>();
        }

        @Override
        public int getOldListSize() {
            return oldList.size();
        }

        @Override
        public int getNewListSize() {
            return newList.size();
        }

        @Override
        public boolean areItemsTheSame(int oldItemPosition, int newItemPosition) {
            Draft oldDraft = oldList.get(oldItemPosition);
            Draft newDraft = newList.get(newItemPosition);

            if (oldDraft.getId() != null && newDraft.getId() != null) {
                return oldDraft.getId().equals(newDraft.getId());
            } else {
                return oldDraft.getTo().equals(newDraft.getTo())
                        && oldDraft.getSubject().equals(newDraft.getSubject())
                        && oldDraft.getBody().equals(newDraft.getBody());
            }
        }

        @Override
        public boolean areContentsTheSame(int oldItemPosition, int newItemPosition) {
            Draft oldDraft = oldList.get(oldItemPosition);
            Draft newDraft = newList.get(newItemPosition);
            return oldDraft.equals(newDraft);
        }
    }
}