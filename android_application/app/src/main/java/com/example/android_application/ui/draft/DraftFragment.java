package com.example.android_application.ui.draft;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.android_application.databinding.FragmentDraftBinding;

/**
 * A Fragment representing the "Draft" screen in the application.
 */
public class DraftFragment extends Fragment {

    // ViewBinding object for accessing views in fragment_draft.xml
    private FragmentDraftBinding binding;

    /**
     * Called to have the fragment instantiate its user interface view.
     *
     * @param inflater           LayoutInflater to inflate views in the fragment
     * @param container          Parent view that the fragment's UI should be attached to
     * @param savedInstanceState Previous state, if available
     * @return The root view of the fragment's layout
     */
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        // Create ViewModel instance tied to this Fragment's lifecycle
        DraftViewModel draftViewModel =
                new ViewModelProvider(this).get(DraftViewModel.class);

        // Inflate the layout using ViewBinding
        binding = FragmentDraftBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        // Access the TextView from the binding
        final TextView textView = binding.textDraft;

        // Observe the LiveData from the ViewModel and update the TextView when it changes
        draftViewModel.getText().observe(getViewLifecycleOwner(), textView::setText);
        return root;
    }

    /**
     * Called when the view hierarchy associated with the fragment is being removed.
     * Good place to null out the binding to avoid memory leaks.
     */
    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}