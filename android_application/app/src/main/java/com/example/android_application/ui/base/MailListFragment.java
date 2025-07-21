package com.example.android_application.ui.base;

import android.content.Intent;
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
import com.example.android_application.ui.search.MailAdapter;
import com.example.android_application.ui.viewMail.ViewMailActivity;
import java.util.List;

public class MailListFragment extends Fragment {

    protected  MailListViewModel mailListViewModel;
    protected MailAdapter mailAdapter;
    protected TextView noResultsTextView;
    protected RecyclerView recyclerView;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container,
                             Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.fragment_mail_list, container, false);

        initViews(view);
        setupRecyclerView();

        LinearLayoutManager layoutManager = (LinearLayoutManager) recyclerView.getLayoutManager();
        recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                if (dy <= 0) return;

                int visibleItemCount = layoutManager.getChildCount();
                int totalItemCount = layoutManager.getItemCount();
                int firstVisibleItemPosition = layoutManager.findFirstVisibleItemPosition();

                if (!mailListViewModel.isLoading && !mailListViewModel.isLastPage) {
                    if ((visibleItemCount + firstVisibleItemPosition) >= totalItemCount
                            && firstVisibleItemPosition >= 0) {
                        mailListViewModel.loadNextPage(getLabel());
                    }
                }
            }
        });

        setupViewModel();

        return view;
    }

    private void initViews(View view) {
        recyclerView = view.findViewById(R.id.recyclerSearchResults);
        noResultsTextView = view.findViewById(R.id.noResultsTextView);
    }

    protected void setupRecyclerView() {
        mailAdapter = new MailAdapter(showReceiverInsteadOfSender());
        recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        recyclerView.setAdapter(mailAdapter);

        mailAdapter.setOnItemClickListener(mail -> {
            Intent intent = new Intent(requireContext(), ViewMailActivity.class);
            intent.putExtra("mail_id", mail.getId());
            startActivity(intent);
        });
    }

    protected void setupViewModel() {
        mailListViewModel = new ViewModelProvider(requireActivity()).get(MailListViewModel.class);

        mailListViewModel.getMailListLiveData().observe(getViewLifecycleOwner(), this::handleMailList);

        mailListViewModel.getErrorMessage().observe(getViewLifecycleOwner(), error -> {
            if (error != null && !error.isEmpty()) {
                Toast.makeText(requireContext(), "Error: " + error, Toast.LENGTH_SHORT).show();
            }
        });
    }

    protected void handleMailList(List<Mail> mails) {
        if (mails != null && !mails.isEmpty()) {
            mailAdapter.setMailList(mails);
            recyclerView.setVisibility(View.VISIBLE);
            noResultsTextView.setVisibility(View.GONE);
        } else {
            recyclerView.setVisibility(View.GONE);
            noResultsTextView.setVisibility(View.VISIBLE);
        }
    }

    protected String getLabel() {
        return "Inbox"; // default, override in InboxFragment etc.
    }

    protected boolean showReceiverInsteadOfSender() {
        return false;
    }
}
