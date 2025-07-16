package com.example.android_application.ui.sent;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.android_application.databinding.FragmentSentBinding;

public class SentFragment extends Fragment {

    private FragmentSentBinding binding;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        SentViewModel sentViewModel =
                new ViewModelProvider(this).get(SentViewModel.class);

        binding = FragmentSentBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        final TextView textView = binding.textSent;
        sentViewModel.getText().observe(getViewLifecycleOwner(), textView::setText);
        return root;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}