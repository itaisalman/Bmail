package com.example.android_application.ui.spam;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.android_application.databinding.FragmentSpamBinding;

/**
 * A Fragment representing the "Spam" screen in the application.
 */
public class SpamFragment extends Fragment {

    // ViewBinding object to access views in fragment_spam.xml
    private FragmentSpamBinding binding;

    /**
     * Called to create and return the view hierarchy associated with this fragment.
     *
     * @param inflater           LayoutInflater used to inflate the layout for the fragment
     * @param container          The parent view to which the fragment's UI should be attached
     * @param savedInstanceState Saved instance state from previous configurations (if any)
     * @return The root view of the fragment's layout
     */
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        // Create the ViewModel scoped to this Fragment
        SpamViewModel spamViewModel =
                new ViewModelProvider(this).get(SpamViewModel.class);

        // Inflate the layout using ViewBinding
        binding = FragmentSpamBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        // Access the TextView from the layout
        final TextView textView = binding.textSpam;

        // Observe LiveData from the ViewModel and update the TextView when data changes
        spamViewModel.getText().observe(getViewLifecycleOwner(), textView::setText);

        return root;
    }

    /**
     * Called when the fragment's view is being destroyed.
     * Clears the binding reference to prevent memory leaks.
     */
    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
