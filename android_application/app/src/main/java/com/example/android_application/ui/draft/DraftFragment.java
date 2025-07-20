package com.example.android_application.ui.draft;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.example.android_application.R;
import com.example.android_application.data.local.entity.Draft;
import com.example.android_application.ui.bottom_sheet.ComposeBottomSheet;
import com.example.android_application.ui.bottom_sheet.ComposeViewModel;

import java.util.ArrayList;

public class DraftFragment extends Fragment {

    private DraftViewModel draftViewModel;
    private DraftAdapter draftAdapter;
    private RecyclerView recyclerView;
    private TextView noResultsTextView;

    private boolean isLoading = false;
    private boolean isLastPage = false;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container,
                             Bundle savedInstanceState) {

        // Inflate the shared layout used for search results.
        View root = inflater.inflate(R.layout.fragment_search_results, container, false);

        recyclerView = root.findViewById(R.id.recyclerSearchResults);
        noResultsTextView = root.findViewById(R.id.noResultsTextView);

        String userId = getUserIdFromSharedPreferences();

        draftViewModel = new ViewModelProvider(this).get(DraftViewModel.class);
        // Load drafts for specific user.
        draftViewModel.loadDraftsForUser(userId);
        ComposeViewModel composeViewModel = new ViewModelProvider(requireActivity()).get(ComposeViewModel.class);

        draftAdapter = new DraftAdapter(new ArrayList<>(), new DraftAdapter.OnDraftClickListener() {
            @Override
            public void onClick(Draft draft) {
                composeViewModel.setIsDraftClicked(true);
                ComposeBottomSheet bottomSheet = new ComposeBottomSheet();
                Bundle args = new Bundle();
                args.putString("id", draft.getId());
                args.putString("to", draft.getTo());
                args.putString("subject", draft.getSubject());
                args.putString("body", draft.getBody());
                bottomSheet.setArguments(args);
                bottomSheet.show(getParentFragmentManager(), "ComposeBottomSheet");
            }

            @Override
            public void onDelete(Draft draft) {
                // Leave empty for now or handle delete if you want later
            }
        });

        LinearLayoutManager layoutManager = new LinearLayoutManager(requireContext());
        recyclerView.setLayoutManager(layoutManager);
        recyclerView.setAdapter(draftAdapter);

        draftViewModel.getAllDrafts().observe(getViewLifecycleOwner(), drafts -> {
            draftAdapter.setDraftList(drafts);
            noResultsTextView.setVisibility(drafts.isEmpty() ? View.VISIBLE : View.GONE);
            // Reset loading state when new data is received.
            isLoading = false;
        });

        // Scroll listener for pagination.
        recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                if (dy <= 0) return;

                int visibleItemCount = layoutManager.getChildCount();
                int totalItemCount = layoutManager.getItemCount();
                int firstVisibleItemPosition = layoutManager.findFirstVisibleItemPosition();

                if (!isLoading && !isLastPage) {
                    if ((visibleItemCount + firstVisibleItemPosition) >= totalItemCount
                            && firstVisibleItemPosition >= 0) {
                        isLoading = true;
                        draftViewModel.loadNextPage();
                    }
                }
            }
        });
        draftViewModel.getIsLastPage().observe(getViewLifecycleOwner(), lastPage -> isLastPage = lastPage);
        composeViewModel.getNewDraftCreated().observe(getViewLifecycleOwner(), created -> {
            if (Boolean.TRUE.equals(created)) {
                // Reloads the local DB drafts after a new one is added from ComposeBottomSheet.
                draftViewModel.loadDraftsForUser(userId);
                composeViewModel.setNewDraftCreated(false);
            }
        });

        return root;
    }

    @Override
    public void onResume() {
        super.onResume();
        draftViewModel.fetchDraftsFromServer();
    }

    // Retrieves the logged-in user's ID from shared preferences.
    private String getUserIdFromSharedPreferences() {
        return requireContext()
                .getSharedPreferences("MyPrefs", Context.MODE_PRIVATE)
                .getString("userID", null);
    }
}
