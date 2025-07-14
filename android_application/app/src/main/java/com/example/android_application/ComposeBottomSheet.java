package com.example.android_application;

import android.content.res.Configuration;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.android.material.bottomsheet.BottomSheetBehavior;
import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;

public class ComposeBottomSheet extends BottomSheetDialogFragment {

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.bottom_sheet_compose, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        EditText toInput = view.findViewById(R.id.to_input);
        EditText subjectInput = view.findViewById(R.id.subject_input);
        EditText bodyInput = view.findViewById(R.id.body_input);
        Button sendButton = view.findViewById(R.id.send_button);
        ImageButton closeButton = view.findViewById(R.id.close_button);

        if (closeButton != null) {
            closeButton.setOnClickListener(v -> dismiss());
        }

        if (sendButton != null) {
            sendButton.setOnClickListener(v -> {
                String to = toInput.getText().toString();
                String subject = subjectInput.getText().toString();
                String body = bodyInput.getText().toString();

                // TODO: Implement send logic here

                dismiss();
            });
        }
    }

    @Override
    public void onStart() {
        super.onStart();

        // Only adjust behavior for landscape
        if (requireContext().getResources().getConfiguration().orientation == Configuration.ORIENTATION_LANDSCAPE) {
            BottomSheetDialog dialog = (BottomSheetDialog) getDialog();
            if (dialog != null) {
                View bottomSheet = dialog.findViewById(com.google.android.material.R.id.design_bottom_sheet);
                if (bottomSheet != null) {
                    bottomSheet.getLayoutParams().height = ViewGroup.LayoutParams.WRAP_CONTENT;
                    bottomSheet.requestLayout();

                    BottomSheetBehavior<View> behavior = BottomSheetBehavior.from(bottomSheet);
                    behavior.setSkipCollapsed(true);
                    behavior.setState(BottomSheetBehavior.STATE_EXPANDED);
                }
            }
        }
    }
}
