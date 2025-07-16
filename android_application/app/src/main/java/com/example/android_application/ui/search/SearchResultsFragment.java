package com.example.android_application.ui.search;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.android_application.R;
import com.example.android_application.data.local.entity.Mail;
import com.example.android_application.ui.home.HomeViewModel;
import com.example.android_application.ui.search.MailAdapter;

import java.util.List;

public class SearchResultsFragment extends Fragment {

    private HomeViewModel homeViewModel;
    private MailAdapter adapter;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container,
                             Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.fragment_search_results, container, false);
        RecyclerView recyclerView = view.findViewById(R.id.recyclerSearchResults);

        recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));

        adapter = new MailAdapter();
        recyclerView.setAdapter(adapter);

        homeViewModel = new ViewModelProvider(requireActivity()).get(HomeViewModel.class);

        // Observe search results and update RecyclerView
        homeViewModel.getSearchResults().observe(getViewLifecycleOwner(), mails -> {
            if (mails != null && adapter != null) {
                adapter.setMailList(mails);
            }
        });

        // Observe error messages and show Toast
        homeViewModel.getErrorMessage().observe(getViewLifecycleOwner(), error -> {
            if (error != null && !error.isEmpty()) {
                Toast.makeText(requireContext(), "Search error: " + error, Toast.LENGTH_SHORT).show();
            }
        });

        // Optional: setup click listener for mails (if implemented in MailAdapter)
        adapter.setOnItemClickListener(mail -> {
            // TODO: Navigate to full mail view fragment/activity here
            // For example: use Navigation component or FragmentManager to open mail detail
            Toast.makeText(requireContext(), "Clicked mail: " + mail.getTitle(), Toast.LENGTH_SHORT).show();
        });

        return view;
    }
}
