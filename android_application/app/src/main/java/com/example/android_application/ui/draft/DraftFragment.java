package com.example.android_application.ui.draft;

import android.os.Bundle;
import android.util.Log;
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

        View root = inflater.inflate(R.layout.fragment_search_results, container, false);

        recyclerView = root.findViewById(R.id.recyclerSearchResults);
        noResultsTextView = root.findViewById(R.id.noResultsTextView);

        draftViewModel = new ViewModelProvider(this).get(DraftViewModel.class);

        draftAdapter = new DraftAdapter(new ArrayList<>(), new DraftAdapter.OnDraftClickListener() {
            @Override
            public void onClick(Draft draft) {
                // TODO: Open ComposeBottomSheet with this draft
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
            Log.d("DraftFragment", "Observed drafts: " + drafts.size());
            for (Draft d : drafts) {
                Log.d("DraftFragment", "Draft title: " + d.getSubject());
            }
            draftAdapter.setDraftList(drafts);
            noResultsTextView.setVisibility(drafts.isEmpty() ? View.VISIBLE : View.GONE);
            isLoading = false;
        });

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

        isLoading = true;
        draftViewModel.loadNextPage();

        draftViewModel.getIsLastPage().observe(getViewLifecycleOwner(), lastPage -> isLastPage = lastPage);

        return root;
    }
}
