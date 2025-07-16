package com.example.android_application.ui.draft;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.android_application.databinding.FragmentDraftBinding;

public class DraftFragment extends Fragment {

    private FragmentDraftBinding binding;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        DraftViewModel draftViewModel =
                new ViewModelProvider(this).get(DraftViewModel.class);

        binding = FragmentDraftBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        final TextView textView = binding.textDraft;
        draftViewModel.getText().observe(getViewLifecycleOwner(), textView::setText);
        return root;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}