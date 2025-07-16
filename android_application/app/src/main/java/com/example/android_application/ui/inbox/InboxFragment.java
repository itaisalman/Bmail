package com.example.android_application.ui.inbox;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.android_application.databinding.FragmentInboxBinding;

public class InboxFragment extends Fragment {

    private FragmentInboxBinding binding;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        InboxViewModel homeViewModel =
                new ViewModelProvider(this).get(InboxViewModel.class);

        binding = FragmentInboxBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        final TextView textView = binding.textInbox;
        homeViewModel.getText().observe(getViewLifecycleOwner(), textView::setText);
        return root;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}