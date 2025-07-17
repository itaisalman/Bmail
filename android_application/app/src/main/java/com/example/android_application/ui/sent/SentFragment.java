package com.example.android_application.ui.sent;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.android_application.databinding.FragmentSentBinding;

/**
 * A Fragment representing the "Sent" screen in the application.
 */
public class SentFragment extends Fragment {

    // ViewBinding object to access views in fragment_sent.xml
    private FragmentSentBinding binding;

    /**
     * Called to create and return the view hierarchy associated with the fragment.
     *
     * @param inflater           The LayoutInflater object that can be used to inflate any views
     * @param container          The parent view that the fragment UI should be attached to
     * @param savedInstanceState If non-null, this fragment is being re-constructed
     * @return The root view of the fragment's layout
     */
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        // Get an instance of the ViewModel scoped to this fragment
        SentViewModel sentViewModel =
                new ViewModelProvider(this).get(SentViewModel.class);

        // Inflate the layout using ViewBinding
        binding = FragmentSentBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        // Access the TextView from the layout and observe changes from ViewModel
        final TextView textView = binding.textSent;
        sentViewModel.getText().observe(getViewLifecycleOwner(), textView::setText);

        return root;
    }

    /**
     * Called when the view previously created by onCreateView is being destroyed.
     * Cleans up the binding reference to avoid memory leaks.
     */
    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
