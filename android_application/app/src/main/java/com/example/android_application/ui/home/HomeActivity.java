package com.example.android_application.ui.home;

import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.SubMenu;
import android.view.View;
import android.view.Menu;
import android.widget.EditText;
import android.widget.ImageButton;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.widget.SearchView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.example.android_application.data.local.entity.Label;
import com.example.android_application.ui.bottom_sheet.ComposeBottomSheet;
import com.example.android_application.ui.label.LabelViewModel;
import com.example.android_application.ui.login.LoginActivity;
import com.google.android.material.navigation.NavigationView;
import com.example.android_application.R;
import androidx.annotation.NonNull;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import com.bumptech.glide.Glide;
import com.example.android_application.databinding.ActivityHomeBinding;

public class HomeActivity extends AppCompatActivity {

    // Navigation and theme toggle
    private AppBarConfiguration mAppBarConfiguration;
    private ImageButton themeToggleDrawerHeader;

    // State keys and flags
    private static final String ICON_STATE_KEY = "iconState";
    private boolean isDarkModeIconVisible = false;
    private boolean hasNavigatedToSearchResults = false;
    private boolean isCollapsing = false;

    // ViewModel for search and user data
    private HomeViewModel homeViewModel;

    private LabelViewModel labelViewModel;
    private LinearLayout labelsContainer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Restore dark mode icon state
        if (savedInstanceState != null) {
            isDarkModeIconVisible = savedInstanceState.getBoolean(ICON_STATE_KEY, false);
        } else {
            int currentNightMode = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
            isDarkModeIconVisible = (currentNightMode == Configuration.UI_MODE_NIGHT_NO);
        }

        // Setup view binding and toolbar
        ActivityHomeBinding binding = ActivityHomeBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        homeViewModel = new ViewModelProvider(this).get(HomeViewModel.class);
        setSupportActionBar(binding.appBarHome.toolbar);

        // FAB opens compose bottom sheet
        binding.appBarHome.fab.setOnClickListener(view -> {
            ComposeBottomSheet composeSheet = new ComposeBottomSheet();
            composeSheet.show(getSupportFragmentManager(), "compose_bottom_sheet");
        });

        // Setup navigation drawer and header
        DrawerLayout drawer = binding.drawerLayout;
        NavigationView navigationView = binding.navView;
        homeViewModel.getUser();

        // Handle drawer header user data and theme toggle
        View headerView = navigationView.getHeaderView(0);
        if (headerView != null) {
            themeToggleDrawerHeader = headerView.findViewById(R.id.themeToggleDrawerHeader);
            updateThemeToggleButtonIcon();

            themeToggleDrawerHeader.setOnClickListener(v -> {
                isDarkModeIconVisible = !isDarkModeIconVisible;
                updateThemeToggleButtonIcon();
            });

            // Load user details
            TextView nameTextView = headerView.findViewById(R.id.nameTextView);
            TextView usernameTextView = headerView.findViewById(R.id.usernameTextView);
            ImageView profileImageView = headerView.findViewById(R.id.profileImageView);

            homeViewModel.user.observe(this, userJson -> {
                String firstName = userJson.optString("first_name", "");
                String lastName = userJson.optString("last_name", "");
                String username = userJson.optString("username", "");
                String profilePath = userJson.optString("image", "");
                String profileUrl = "http://10.0.2.2:3000/" + profilePath;

                nameTextView.setText(String.format("%s %s", firstName, lastName));
                usernameTextView.setText(username);

                Glide.with(this).load(profileUrl).circleCrop().into(profileImageView);
            });

            // Handle possible errors
            homeViewModel.error.observe(this, errorMessage ->
                    Toast.makeText(this, "error: " + errorMessage, Toast.LENGTH_SHORT).show()
            );
        }

        // Configure navigation drawer destinations
        mAppBarConfiguration = new AppBarConfiguration.Builder(
                R.id.nav_inbox, R.id.nav_star, R.id.nav_important, R.id.nav_sent,
                R.id.nav_draft, R.id.nav_spam)
                .setOpenableLayout(drawer)
                .build();

        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_home);
        NavigationUI.setupActionBarWithNavController(this, navController, mAppBarConfiguration);
        NavigationUI.setupWithNavController(navigationView, navController);

        SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
        String token = prefs.getString("jwt", null);

        LabelViewModel.Factory factory = new LabelViewModel.Factory();
        labelViewModel = new ViewModelProvider(this, factory).get(LabelViewModel.class);
        try {
            Menu menu = navigationView.getMenu();
            SubMenu labelsSubMenu = menu.addSubMenu("");

            labelViewModel.getLabels(token).observe(this, labels -> {
                labelsSubMenu.clear();

                if (labels != null) {
                    for (Label label : labels) {
                        labelsSubMenu.add(label.getName()).setOnMenuItemClickListener(item -> {
                            Toast.makeText(this, "Clicked: " + label.getName(), Toast.LENGTH_SHORT).show();
                            return true;
                        });
                    }
                }

                navigationView.setNavigationItemSelectedListener(item -> {
                    int id = item.getItemId();
                    if (id == R.id.nav_add_label) {
                        showAddLabelDialog(labelsContainer, labelViewModel, token);
                        return true;
                    }
                    return false;
                });
            });

        } catch (Exception e) {
            Log.e("HomeActivity", "Error in label section: " + e.getMessage(), e);
        }
    }

    // Save icon state on rotation
    @Override
    protected void onSaveInstanceState(@NonNull Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putBoolean(ICON_STATE_KEY, isDarkModeIconVisible);
    }

    // Toggle dark/light mode icon in drawer
    private void updateThemeToggleButtonIcon() {
        if (themeToggleDrawerHeader != null) {
            int iconRes = isDarkModeIconVisible ? R.drawable.ic_dark_mode : R.drawable.ic_light_mode;
            themeToggleDrawerHeader.setImageResource(iconRes);
        }
    }

    // Configure search functionality in toolbar
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.home, menu);

        MenuItem searchItem = menu.findItem(R.id.action_search);
        SearchView searchView = (SearchView) searchItem.getActionView();

        if (searchView != null) {
            searchView.setMaxWidth(Integer.MAX_VALUE);

            // Handle search input changes
            searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
                @Override
                public boolean onQueryTextSubmit(String query) {
                    searchView.clearFocus();
                    return true;
                }

                @Override
                public boolean onQueryTextChange(String newText) {
                    homeViewModel.setCurrentSearchQuery(newText);
                    String token = getSharedPreferences("auth", MODE_PRIVATE).getString("jwt", null);
                    if (token == null) return true;

                    String trimmedText = newText.trim();
                    if (!trimmedText.isEmpty()) {
                        homeViewModel.searchMails(token, trimmedText);

                        NavController navController = Navigation.findNavController(
                                HomeActivity.this, R.id.nav_host_fragment_content_home
                        );

                        if (!hasNavigatedToSearchResults &&
                                navController.getCurrentDestination() != null &&
                                navController.getCurrentDestination().getId() != R.id.searchResultsFragment) {

                            navController.navigate(R.id.action_global_searchResultsFragment);
                            hasNavigatedToSearchResults = true;
                        }
                    } else {
                        // Clear results only if not caused by collapse (only by clearing the input)
                        if (!isCollapsing) {
                            homeViewModel.clearSearchResults();
                        }
                    }

                    return true;
                }
            });

            // Reset collapse flag on focus loss
            searchView.setOnQueryTextFocusChangeListener((v, hasFocus) -> {
                if (!hasFocus) {
                    isCollapsing = false;
                }
            });

            // Handle expand/collapse of SearchView
            searchItem.setOnActionExpandListener(new MenuItem.OnActionExpandListener() {
                @Override
                public boolean onMenuItemActionExpand(@NonNull MenuItem item) {
                    hasNavigatedToSearchResults = false;
                    return true;
                }

                @Override
                public boolean onMenuItemActionCollapse(@NonNull MenuItem item) {
                    isCollapsing = true;
                    hasNavigatedToSearchResults = false;
                    return true;
                }
            });
        }

        return true;
    }

    // Handle menu item clicks
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.action_search) {
            return true;
        } else if (id == R.id.action_logout) {
            SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
            prefs.edit().clear().apply();

            Intent intent = new Intent(this, LoginActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    // Handle navigation "up" button in toolbar
    @Override
    public boolean onSupportNavigateUp() {
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_home);
        return NavigationUI.navigateUp(navController, mAppBarConfiguration)
                || super.onSupportNavigateUp();
    }
    private void addLabelToUI(String labelName, LinearLayout container) {
        TextView labelView = new TextView(this);
        labelView.setText(labelName);
        labelView.setPadding(0, 8, 0, 8);
        labelView.setTextSize(14);
        labelView.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_label, 0, 0, 0);
        labelView.setCompoundDrawablePadding(16);

        labelView.setOnClickListener(v -> {
            Toast.makeText(this, "Clicked label: " + labelName, Toast.LENGTH_SHORT).show();
        });

        container.addView(labelView);
    }

    private void showAddLabelDialog(LinearLayout labelsContainer, LabelViewModel labelViewModel, String token) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Add Label");

        final EditText input = new EditText(this);
        input.setHint("Label name");
        builder.setView(input);

        builder.setPositiveButton("Add", (dialog, which) -> {
            String labelName = input.getText().toString().trim();
            if (!labelName.isEmpty()) {
                labelViewModel.createLabel(token, labelName).observe(this, label -> {
                    if (label != null) {
                        addLabelToUI(label.getName(), labelsContainer);
                    } else {
                        Toast.makeText(this, "Failed to create label", Toast.LENGTH_SHORT).show();
                    }
                });
            }
        });

        builder.setNegativeButton("Cancel", (dialog, which) -> dialog.cancel());
        builder.show();
    }

    private int findMenuItemIndex(Menu menu, MenuItem target) {
        for (int i = 0; i < menu.size(); i++) {
            if (menu.getItem(i).getItemId() == target.getItemId()) {
                return i;
            }
        }
        return menu.size();
    }

    private void removeOldLabelItems(Menu menu, int fromIndex) {
        while (menu.size() > fromIndex) {
            menu.removeItem(menu.getItem(fromIndex).getItemId());
        }
    }

    private void showAddLabelDialog(LabelViewModel labelViewModel, String token) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Add Label");

        final EditText input = new EditText(this);
        input.setHint("Label name");
        builder.setView(input);

        builder.setPositiveButton("Add", (dialog, which) -> {
            String labelName = input.getText().toString().trim();
            if (!labelName.isEmpty()) {
                labelViewModel.createLabel(token, labelName).observe(this, label -> {
                    if (label == null) {
                        Toast.makeText(this, "Failed to create label", Toast.LENGTH_SHORT).show();
                    }
                });
            }
        });

        builder.setNegativeButton("Cancel", (dialog, which) -> dialog.cancel());
        builder.show();
    }
}
