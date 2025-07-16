package com.example.android_application.ui.spam;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.android_application.databinding.FragmentSpamBinding;

public class SpamFragment extends Fragment {

    private FragmentSpamBinding binding;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        SpamViewModel spamViewModel =
                new ViewModelProvider(this).get(SpamViewModel.class);

        binding = FragmentSpamBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        final TextView textView = binding.textSpam;
        spamViewModel.getText().observe(getViewLifecycleOwner(), textView::setText);
        return root;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}