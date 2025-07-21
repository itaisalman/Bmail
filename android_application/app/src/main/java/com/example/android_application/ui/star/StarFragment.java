package com.example.android_application.ui.star;

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

public class StarFragment extends MailListFragment {

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
        StarViewModel.Factory factory = new StarViewModel.Factory(requireActivity().getApplication(), currentUserEmail);
        mailListViewModel = new ViewModelProvider(this, factory).get(StarViewModel.class);

        mailListViewModel.getMailListLiveData().observe(getViewLifecycleOwner(), this::handleMailList);
        mailListViewModel.getErrorMessage().observe(getViewLifecycleOwner(), error -> {
            if (error != null && !error.isEmpty()) {
                Toast.makeText(requireContext(), "Search error: " + error, Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    protected String getLabel() {
        return "Starred";
    }

    @Override
    public void onResume() {
        super.onResume();
        mailListViewModel.initMails(getLabel());
    }
}
