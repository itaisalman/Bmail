package com.example.android_application.ui.bottom_sheet;

import android.app.Dialog;
import android.content.res.Resources;
import android.graphics.Color;
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

    // Inflate the layout for the bottom sheet UI
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

        // Initialize ViewModel with application context
        viewModel = new ViewModelProvider(this,
                new ViewModelProvider.AndroidViewModelFactory(requireActivity().getApplication()))
                .get(ComposeViewModel.class);

        // Save draft and dismiss when close (X) is pressed
        closeButton.setOnClickListener(v -> {
            viewModel.saveDraft(
                    toInput.getText().toString(),
                    subjectInput.getText().toString(),
                    bodyInput.getText().toString()
            );
            dismiss();
        });

        // Send mail when send button is pressed
        sendButton.setOnClickListener(v ->
                viewModel.sendMail(toInput.getText().toString(), subjectInput.getText().toString(), bodyInput.getText().toString())
        );

        // Observe LiveData for success or error
        observeViewModel();
    }

    private void observeViewModel() {
        // Dismiss bottom sheet when mail is sent successfully
        viewModel.mailSent.observe(getViewLifecycleOwner(), success -> {
            if (success != null && success) {
                dismiss();
            }
        });

        // Show error toast if sending or saving draft fails
        viewModel.error.observe(getViewLifecycleOwner(), error -> {
            if (error != null) {
                Toast.makeText(requireContext(), error, Toast.LENGTH_SHORT).show();
            }
        });
    }

    @NonNull
    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        BottomSheetDialog dialog = (BottomSheetDialog) super.onCreateDialog(savedInstanceState);

        dialog.setOnShowListener(dialogInterface -> {
            BottomSheetDialog d = (BottomSheetDialog) dialogInterface;
            FrameLayout bottomSheet = d.findViewById(com.google.android.material.R.id.design_bottom_sheet);

            if (bottomSheet != null) {
                bottomSheet.setBackgroundColor(Color.TRANSPARENT);

                // Set bottom sheet height to 5/6 of the screen
                ViewGroup.LayoutParams layoutParams = bottomSheet.getLayoutParams();
                layoutParams.height = (int) (Resources.getSystem().getDisplayMetrics().heightPixels * 5f / 6f);
                bottomSheet.setLayoutParams(layoutParams);
            }
        });

        return dialog;
    }

    @Override
    public void onStart() {
        super.onStart();

        // Expand the bottom sheet fully on start and skip collapsed state
        BottomSheetDialog dialog = (BottomSheetDialog) getDialog();
        if (dialog != null) {
            View bottomSheet = dialog.findViewById(com.google.android.material.R.id.design_bottom_sheet);
            if (bottomSheet != null) {
                BottomSheetBehavior<View> behavior = BottomSheetBehavior.from(bottomSheet);
                behavior.setSkipCollapsed(true);
                behavior.setState(BottomSheetBehavior.STATE_EXPANDED);
            }
        }
    }

    // Ensure the window resizes properly when the keyboard appears
    @Override
    public void onResume() {
        super.onResume();
        if (getDialog() != null && getDialog().getWindow() != null) {
            getDialog().getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        }
    }
}
