package com.example.android_application.ui.search;

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

import java.util.List;

public class SearchResultsFragment extends Fragment {

    private HomeViewModel homeViewModel;
    private MailAdapter adapter;
    private TextView noResultsTextView;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container,
                             Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.fragment_search_results, container, false);

        RecyclerView recyclerView = view.findViewById(R.id.recyclerSearchResults);
        noResultsTextView = view.findViewById(R.id.noResultsTextView);

        recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));

        adapter = new MailAdapter();
        recyclerView.setAdapter(adapter);

        homeViewModel = new ViewModelProvider(requireActivity()).get(HomeViewModel.class);

        // Observe search results and update UI
        homeViewModel.getSearchResults().observe(getViewLifecycleOwner(), mails -> {
            if (mails != null && !mails.isEmpty()) {
                adapter.setMailList(mails);
                recyclerView.setVisibility(View.VISIBLE);
                noResultsTextView.setVisibility(View.GONE);
            } else {
                // Show "No results" text and hide RecyclerView if list is empty or null
                recyclerView.setVisibility(View.GONE);
                noResultsTextView.setVisibility(View.VISIBLE);
            }
        });

        homeViewModel.getErrorMessage().observe(getViewLifecycleOwner(), error -> {
            if (error != null && !error.isEmpty()) {
                Toast.makeText(requireContext(), "Search error: " + error, Toast.LENGTH_SHORT).show();
            }
        });

        adapter.setOnItemClickListener(mail -> {
            // TODO: implement mail click handling
            Toast.makeText(requireContext(), "Clicked mail: " + mail.getTitle(), Toast.LENGTH_SHORT).show();
        });

        return view;
    }
}
