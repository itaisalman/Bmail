package com.example.android_application.ui.label;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.CheckBox;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.lifecycle.LifecycleOwner;

import com.example.android_application.R;
import com.example.android_application.data.local.AppDatabase;
import com.example.android_application.data.local.entity.Label;

import java.util.List;

public class LabelCheckboxAdapter extends ArrayAdapter<Label> {
    private final String mailId;
    private final LabelViewModel labelViewModel;
    private final LifecycleOwner lifecycleOwner;
    private final List<String> mailLabelIds;
    private final Runnable onLabelChanged;

    public LabelCheckboxAdapter(Context context, List<Label> labels, String mailId,
                                List<String> mailLabelIds, LabelViewModel labelViewModel,
                                LifecycleOwner lifecycleOwner,
                                Runnable onLabelChanged) {
        super(context, 0, labels);
        this.mailId = mailId;
        this.mailLabelIds = mailLabelIds;
        this.labelViewModel = labelViewModel;
        this.lifecycleOwner = lifecycleOwner;
        this.onLabelChanged = onLabelChanged;
    }


    @NonNull
    @Override
    public View getView(int position, View convertView, @NonNull ViewGroup parent) {
        Label label = getItem(position);
        View rowView = convertView;
        if (rowView == null) {
            rowView = LayoutInflater.from(getContext()).inflate(R.layout.item_label_with_checkbox, parent, false);
        }

        TextView labelName = rowView.findViewById(R.id.label_name);
        CheckBox checkBox = rowView.findViewById(R.id.label_checkbox);

        labelName.setText(label.getName());
        boolean isAssigned = mailLabelIds.contains(label.getId());
        checkBox.setChecked(isAssigned);

        checkBox.setClickable(false);

        rowView.setOnClickListener(v -> {
            boolean wasAssigned = mailLabelIds.contains(label.getId());

            if (wasAssigned) {
                labelViewModel.removeLabelFromMail(mailId, label.getId()).observe(lifecycleOwner, success -> {
                    if (Boolean.TRUE.equals(success)) {
                        mailLabelIds.remove(label.getId());
                        checkBox.setChecked(false);
                        Toast.makeText(getContext(), "Label removed", Toast.LENGTH_SHORT).show();
                        notifyDataSetChanged();

                        label.getMails().remove(mailId);
                        AppDatabase.databaseWriteExecutor.execute(() -> AppDatabase.getDatabase(getContext()).labelDao().insertLabel(label));

                        if (onLabelChanged != null) onLabelChanged.run();
                    } else {
                        Toast.makeText(getContext(), "Failed to remove label", Toast.LENGTH_SHORT).show();
                    }
                });
            } else {
                labelViewModel.assignLabelToMail(mailId, label.getId()).observe(lifecycleOwner, success -> {
                    if (Boolean.TRUE.equals(success)) {
                        mailLabelIds.add(label.getId());
                        checkBox.setChecked(true);
                        Toast.makeText(getContext(), "Label assigned", Toast.LENGTH_SHORT).show();
                        notifyDataSetChanged();

                        label.getMails().add(mailId);
                        AppDatabase.databaseWriteExecutor.execute(() -> AppDatabase.getDatabase(getContext()).labelDao().insertLabel(label));

                        if (onLabelChanged != null) {
                            onLabelChanged.run();
                        } else {
                        }

                    } else {
                        Toast.makeText(getContext(), "Failed to assign label", Toast.LENGTH_SHORT).show();
                    }
                });

            }
        });

        return rowView;
    }

}

