package com.example.android_application.ui.star;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.android_application.databinding.FragmentStarBinding;

/**
 * A Fragment representing the "Starred" screen in the application.
 */
public class StarFragment extends Fragment {

    // ViewBinding object to access views in fragment_star.xml
    private FragmentStarBinding binding;

    /**
     * Called to inflate the layout and set up the ViewModel observer.
     *
     * @param inflater           The LayoutInflater used to inflate the view
     * @param container          The parent view that the UI should be attached to
     * @param savedInstanceState Bundle with saved state (if any)
     * @return The root view of the fragment's layout
     */
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        // Create a ViewModel instance scoped to this Fragment
        StarViewModel starViewModel =
                new ViewModelProvider(this).get(StarViewModel.class);

        // Inflate the layout using ViewBinding
        binding = FragmentStarBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        // Access the TextView from the layout
        final TextView textView = binding.textStar;

        // Observe LiveData from the ViewModel and update the TextView when the value changes
        starViewModel.getText().observe(getViewLifecycleOwner(), textView::setText);

        return root;
    }

    /**
     * Called when the view is being destroyed.
     * Clears the binding reference to avoid memory leaks.
     */
    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
