package com.example.android_application.ui.important;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.lifecycle.ViewModelProvider;
import com.example.android_application.ui.base.MailListFragment;

public class ImportantFragment extends MailListFragment {

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
        ImportantViewModel.Factory factory = new ImportantViewModel.Factory(requireActivity().getApplication(), currentUserEmail);
        mailListViewModel = new ViewModelProvider(this, factory).get(ImportantViewModel.class);

        mailListViewModel.getMailListLiveData().observe(getViewLifecycleOwner(), this::handleMailList);
        mailListViewModel.getErrorMessage().observe(getViewLifecycleOwner(), error -> {
            if (error != null && !error.isEmpty()) {
                Toast.makeText(requireContext(), "Search error: " + error, Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    protected String getLabel() {
        return "Important";
    }

    @Override
    public void onResume() {
        super.onResume();
        mailListViewModel.initMails(getLabel());
    }
}
