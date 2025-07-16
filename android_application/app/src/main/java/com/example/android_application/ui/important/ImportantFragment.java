package com.example.android_application.ui.important;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.android_application.databinding.FragmentImportantBinding;

public class ImportantFragment extends Fragment {

    private FragmentImportantBinding binding;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        ImportantViewModel importantViewModel =
                new ViewModelProvider(this).get(ImportantViewModel.class);

        binding = FragmentImportantBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        final TextView textView = binding.textImportant;
        importantViewModel.getText().observe(getViewLifecycleOwner(), textView::setText);
        return root;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}