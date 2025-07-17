package com.example.android_application.ui.inbox;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.android_application.databinding.FragmentInboxBinding;

/**
 * A Fragment representing the "Inbox" screen in the application.
 */
public class InboxFragment extends Fragment {

    // ViewBinding object to access views in fragment_inbox.xml
    private FragmentInboxBinding binding;

    /**
     * Called to inflate the fragment's UI and set up ViewModel observation.
     *
     * @param inflater           LayoutInflater used to inflate any views in the fragment
     * @param container          Parent view that the fragment's UI should be attached to
     * @param savedInstanceState Bundle containing previous saved state (if any)
     * @return The root view of the fragment's layout
     */
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        // Create a ViewModel instance scoped to this Fragment
        InboxViewModel homeViewModel =
                new ViewModelProvider(this).get(InboxViewModel.class);

        // Inflate the layout using ViewBinding
        binding = FragmentInboxBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        // Reference the TextView from the binding
        final TextView textView = binding.textInbox;

        // Observe LiveData from the ViewModel and update the TextView when data changes
        homeViewModel.getText().observe(getViewLifecycleOwner(), textView::setText);

        return root;
    }

    /**
     * Called when the fragment's view is destroyed.
     * Clears the binding reference to avoid memory leaks.
     */
    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
