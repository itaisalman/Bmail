package com.example.android_application.ui.bottom_sheet;

import android.content.res.Configuration;
import android.os.Bundle;
import android.view.*;
import android.widget.*;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.ViewModelProvider;

import com.example.android_application.R;
import com.google.android.material.bottomsheet.BottomSheetBehavior;
import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;

public class ComposeBottomSheet extends BottomSheetDialogFragment {

    private ComposeViewModel viewModel;

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

        viewModel = new ViewModelProvider(this,
                new ViewModelProvider.AndroidViewModelFactory(requireActivity().getApplication()))
                .get(ComposeViewModel.class);

        closeButton.setOnClickListener(v -> {
            viewModel.saveDraft(
                    toInput.getText().toString(),
                    subjectInput.getText().toString(),
                    bodyInput.getText().toString()
            );
            dismiss();
        });

        sendButton.setOnClickListener(v -> {
            viewModel.sendMail(
                    toInput.getText().toString(),
                    subjectInput.getText().toString(),
                    bodyInput.getText().toString()
            );
        });

        observeViewModel();
    }

    private void observeViewModel() {
        viewModel.mailSent.observe(getViewLifecycleOwner(), success -> {
            if (success != null && success) {
                dismiss();
            }
        });

        viewModel.error.observe(getViewLifecycleOwner(), error -> {
            if (error != null) {
                Toast.makeText(requireContext(), "Error: " + error, Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public void onStart() {
        super.onStart();
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

