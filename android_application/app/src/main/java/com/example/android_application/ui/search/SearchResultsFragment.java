package com.example.android_application.ui.search;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.example.android_application.R;
import com.example.android_application.data.local.entity.Mail;
import com.example.android_application.ui.home.HomeViewModel;
import com.example.android_application.ui.viewMail.ViewMailActivity;
import java.util.List;

public class SearchResultsFragment extends Fragment {

    private HomeViewModel homeViewModel;
    private MailAdapter adapter;
    private TextView noResultsTextView;
    private RecyclerView recyclerView;

    // Inflate layout and initialize UI components and observers.
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container,
                             Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.fragment_mail_list, container, false);

        initViews(view);
        setupRecyclerView();
        setupViewModelObservers();

        return view;
    }

    // Initialize references to views inside the fragment layout.
    private void initViews(View view) {
        recyclerView = view.findViewById(R.id.recyclerSearchResults);
        noResultsTextView = view.findViewById(R.id.noResultsTextView);
    }

    // Setup RecyclerView with adapter and click listener.
    private void setupRecyclerView() {
        adapter = new MailAdapter(false);
        recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        recyclerView.setAdapter(adapter);

        adapter.setOnItemClickListener(mail -> {
            Intent intent = new Intent(requireContext(), ViewMailActivity.class);
            intent.putExtra("mail_id", mail.getId());
            startActivity(intent);
        });
    }

    // Initialize ViewModel and observe LiveData to update UI.
    private void setupViewModelObservers() {
        homeViewModel = new ViewModelProvider(requireActivity()).get(HomeViewModel.class);
        homeViewModel.getSearchResults().observe(getViewLifecycleOwner(), this::handleSearchResults);

        homeViewModel.getErrorMessage().observe(getViewLifecycleOwner(), error -> {
            if (error != null && !error.isEmpty()) {
                Toast.makeText(requireContext(), "Search error: " + error, Toast.LENGTH_SHORT).show();
                homeViewModel.clearErrorMessage();
            }
        });
    }

    // Show mails or display "no results" message based on data availability.
    private void handleSearchResults(List<Mail> mails) {
        if (mails != null && !mails.isEmpty()) {
            adapter.setMailList(mails);
            recyclerView.setVisibility(View.VISIBLE);
            noResultsTextView.setVisibility(View.GONE);
        } else {
            recyclerView.setVisibility(View.GONE);
            noResultsTextView.setVisibility(View.VISIBLE);
        }
    }
}
