package com.example.android_application.ui.label;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;
import androidx.appcompat.widget.Toolbar;

import androidx.annotation.NonNull;
import androidx.lifecycle.ViewModelProvider;

import com.example.android_application.R;
import com.example.android_application.ui.base.MailListFragment;

public class LabelFragment extends MailListFragment {
    private String labelId;
    private String labelName;


    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container,
                             Bundle savedInstanceState) {
        return super.onCreateView(inflater, container, savedInstanceState);
    }

    @Override
    protected void setupViewModel() {
        SharedPreferences prefs = requireActivity().getSharedPreferences("auth", Context.MODE_PRIVATE);
        String currentUserEmail = prefs.getString("username", null);
        labelId = getArguments().getString("labelId");
        labelName = getArguments().getString("labelName");
        Toolbar toolbar = requireActivity().findViewById(R.id.toolbar);
        if (toolbar != null) {
            toolbar.setTitle(labelName);
        }


        LabelMailsViewModel.Factory factory = new LabelMailsViewModel.Factory(
                requireActivity().getApplication(), currentUserEmail, labelName
        );
        mailListViewModel = new ViewModelProvider(this, factory).get(LabelMailsViewModel.class);
        mailListViewModel.getMailListLiveData().observe(getViewLifecycleOwner(), this::handleMailList);
        mailListViewModel.getErrorMessage().observe(getViewLifecycleOwner(), error -> {
            if (error != null && !error.isEmpty()) {
                Toast.makeText(requireContext(), "Search error: " + error, Toast.LENGTH_SHORT).show();
            }
        });
    }


    @Override
    protected String getLabel() {
        return labelName;
    }

    @Override
    public void onResume() {
        super.onResume();
        mailListViewModel.initMails(getLabel());
    }


}
