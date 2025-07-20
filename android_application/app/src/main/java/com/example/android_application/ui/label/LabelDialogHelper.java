package com.example.android_application.ui.label;

import android.app.AlertDialog;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.lifecycle.LifecycleOwner;

import com.example.android_application.R;
import com.example.android_application.data.local.entity.Label;
import com.example.android_application.data.local.entity.Mail;
import com.example.android_application.data.repository.LabelRepository;

import java.util.List;

public class LabelDialogHelper {
    /**
     * Displays a dialog to add a new label.
     * Validates input and shows an error if the name is empty or already exists.
     */
    public static void showAddLabelDialog(Context context, LabelViewModel viewModel, LifecycleOwner owner) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setTitle("Add Label");

        // Inflate custom layout with input field and error text
        View dialogView = LayoutInflater.from(context).inflate(R.layout.dialog_add_label, null);
        builder.setView(dialogView);

        EditText input = dialogView.findViewById(R.id.editLabelName);
        TextView errorText = dialogView.findViewById(R.id.errorText);

        builder.setPositiveButton("Add", null);
        builder.setNegativeButton("Cancel", (dialog, which) -> dialog.cancel());

        AlertDialog dialog = builder.create();
        dialog.show();

        Button addButton = dialog.getButton(AlertDialog.BUTTON_POSITIVE);
        addButton.setOnClickListener(v -> {
            String labelName = input.getText().toString().trim();
            if (labelName.isEmpty()) {
                errorText.setText(R.string.error_empty_name);
                errorText.setVisibility(View.VISIBLE);
                return;
            }

            // Attempt to create label via ViewModel
            viewModel.createLabel(labelName).observe(owner, label -> {
                if (label == null) {
                    errorText.setText(R.string.error_duplicate_name);
                    errorText.setVisibility(View.VISIBLE);
                } else {
                    viewModel.fetchLabels();
                    dialog.dismiss();
                }
            });
        });
    }


    /**
     * Displays a dialog to edit an existing label.
     * If the name changes, updates the label via ViewModel.
     */
    public static void showEditLabelDialog(Context context, Label label, LabelViewModel viewModel, LifecycleOwner owner) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setTitle("Edit Label");

        final EditText input = new EditText(context);
        input.setText(label.getName());
        builder.setView(input);

        // Save button to trigger update if the name was changed
        builder.setPositiveButton("Save", (dialog, which) -> {
            String newName = input.getText().toString().trim();
            if (!newName.isEmpty() && !newName.equals(label.getName())) {
                viewModel.updateLabel(label.getId(), newName).observe(owner, success -> {
                    if (Boolean.TRUE.equals(success)) {
                        Toast.makeText(context, "Label updated", Toast.LENGTH_SHORT).show();
                        viewModel.fetchLabels();
                    } else {
                        Toast.makeText(context, "Failed to update label", Toast.LENGTH_SHORT).show();
                    }
                });
            }
        });

        // Cancel button
        builder.setNegativeButton("Cancel", (dialog, which) -> dialog.cancel());
        builder.show();
    }

    /**
     * Displays a confirmation dialog to delete a label.
     * If confirmed, deletes the label via ViewModel.
     */
    public static void showDeleteLabelDialog(Context context, Label label, LabelViewModel viewModel, LifecycleOwner owner) {
        new AlertDialog.Builder(context)
                .setTitle("Delete Label")
                .setMessage("Delete the label \"" + label.getName() + "\"?")
                .setPositiveButton("Delete", (dialog, which) -> viewModel.deleteLabel(label.getId()).observe(owner, success -> {
                    if (Boolean.TRUE.equals(success)) {
                        Toast.makeText(context, "Label deleted", Toast.LENGTH_SHORT).show();
                        viewModel.fetchLabels();
                    } else {
                        Toast.makeText(context, "Delete failed", Toast.LENGTH_SHORT).show();
                    }
                }))
                .setNegativeButton("Cancel", null)
                .show();
    }

    public static void showLabelAssignmentDialog(
            Context context,
            Mail mail,
            LabelViewModel labelViewModel,
            LifecycleOwner owner
    ) {
        String mailId = mail.getId();

        LabelRepository labelRepository = new LabelRepository(context);
        labelRepository.getAllLabelsLocal().observe(owner, labels -> {
            if (labels == null || labels.isEmpty()) {
                Toast.makeText(context, "No labels available", Toast.LENGTH_SHORT).show();
                return;
            }

            String[] labelNames = new String[labels.size()];
            boolean[] checkedItems = new boolean[labels.size()];

            for (int i = 0; i < labels.size(); i++) {
                labelNames[i] = labels.get(i).getName();

                List<String> mailIds = labels.get(i).getMails();
                checkedItems[i] = mailIds != null && mailIds.contains(mailId);
            }

            AlertDialog.Builder builder = new AlertDialog.Builder(context);
            builder.setTitle("Assign/Remove labels");

            builder.setMultiChoiceItems(labelNames, checkedItems, (dialogInterface, index, isChecked) -> {
                String labelId = labels.get(index).getId();

                if (isChecked) {
                    labelViewModel.assignLabelToMail(mailId, labelId);
                } else {
                    labelViewModel.removeLabelFromMail(mailId, labelId);
                }
            });

            builder.setNegativeButton("Cancel", null);
            builder.create().show();
        });
    }



}
