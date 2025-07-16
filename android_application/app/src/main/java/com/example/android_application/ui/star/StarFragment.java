package com.example.android_application.ui.star;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.android_application.databinding.FragmentStarBinding;

public class StarFragment extends Fragment {

    private FragmentStarBinding binding;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        StarViewModel StarViewModel =
                new ViewModelProvider(this).get(StarViewModel.class);

        binding = FragmentStarBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        final TextView textView = binding.textStar;
        StarViewModel.getText().observe(getViewLifecycleOwner(), textView::setText);
        return root;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}