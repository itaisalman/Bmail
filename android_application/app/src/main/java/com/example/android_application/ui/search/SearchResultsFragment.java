package com.example.android_application.ui.search;

import android.os.Bundle;
import android.util.Log;
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

import java.util.List;

public class SearchResultsFragment extends Fragment {

    private HomeViewModel homeViewModel;
    private MailAdapter adapter;
    private TextView noResultsTextView;
    private RecyclerView recyclerView;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container,
                             Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.fragment_search_results, container, false);

        initViews(view);
        setupRecyclerView();
        setupViewModelObservers();

        return view;
    }

    private void initViews(View view) {
        recyclerView = view.findViewById(R.id.recyclerSearchResults);
        noResultsTextView = view.findViewById(R.id.noResultsTextView);
    }

    private void setupRecyclerView() {
        adapter = new MailAdapter();
        recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        recyclerView.setAdapter(adapter);

        adapter.setOnItemClickListener(mail ->
                Toast.makeText(requireContext(), "Clicked mail: " + mail.getTitle(), Toast.LENGTH_SHORT).show()
        );
    }

    private void setupViewModelObservers() {
        homeViewModel = new ViewModelProvider(requireActivity()).get(HomeViewModel.class);

        homeViewModel.getSearchResults().observe(getViewLifecycleOwner(), mails -> {
            if (mails == null) {
                Log.d("SearchResultsFragment", "Search results: null");
            } else {
                Log.d("SearchResultsFragment", "Search results size: " + mails.size());
            }
            handleSearchResults(mails);
        });

        homeViewModel.getErrorMessage().observe(getViewLifecycleOwner(), error -> {
            if (error != null && !error.isEmpty()) {
                Toast.makeText(requireContext(), "Search error: " + error, Toast.LENGTH_SHORT).show();
            }
        });
    }


    private void handleSearchResults(List<Mail> mails) {
        if (mails != null && !mails.isEmpty()) {
            adapter.setMailList(mails);
            recyclerView.setVisibility(View.VISIBLE);
            noResultsTextView.setVisibility(View.GONE);
        } else {
            Log.d("Here", "got here");
            recyclerView.setVisibility(View.GONE);
            noResultsTextView.setVisibility(View.VISIBLE);
        }
    }
}
