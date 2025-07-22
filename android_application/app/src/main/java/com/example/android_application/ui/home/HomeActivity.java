package com.example.android_application.ui.home;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.Menu;
import android.widget.Button;
import android.widget.ImageButton;
import androidx.appcompat.widget.SearchView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import com.example.android_application.data.local.entity.Label;
import com.example.android_application.data.repository.UserRepository;
import com.example.android_application.ui.BaseThemedActivity;
import com.example.android_application.ui.bottom_sheet.ComposeBottomSheet;
import com.example.android_application.ui.label.LabelDialogHelper;
import com.example.android_application.ui.label.LabelViewModel;
import com.example.android_application.ui.login.LoginActivity;
import com.google.android.material.navigation.NavigationView;
import com.example.android_application.R;
import androidx.annotation.NonNull;
import androidx.core.view.GravityCompat;
import androidx.navigation.NavController;
import androidx.navigation.NavOptions;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.lifecycle.ViewModelProvider;
import com.bumptech.glide.Glide;
import com.example.android_application.databinding.ActivityHomeBinding;
import java.util.List;

public class HomeActivity extends BaseThemedActivity {

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
    private UserRepository  userRepository;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Restore dark mode icon state
        if (savedInstanceState != null) {
            isDarkModeIconVisible = savedInstanceState.getBoolean(ICON_STATE_KEY, false);
        } else {
            SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
            String theme = prefs.getString("theme", "light");
            isDarkModeIconVisible = theme.equals("dark");
        }

        // Setup view binding and toolbar
        ActivityHomeBinding binding = ActivityHomeBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        homeViewModel = new ViewModelProvider(this).get(HomeViewModel.class);
        labelViewModel = new ViewModelProvider(this).get(LabelViewModel.class);
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

                // Determine theme
                String selectedTheme = isDarkModeIconVisible ? "dark" : "light";

                // Save new theme locally.
                SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
                SharedPreferences.Editor editor = prefs.edit();
                editor.putString("theme", selectedTheme);
                editor.apply();
                String token = prefs.getString("jwt", "");
                userRepository = new UserRepository();
                userRepository.updateUserTheme(this, token, selectedTheme);
                // Restart activity to apply new theme
                recreate();
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

                // Save userID in SharedPreferences in order to extract only it's values from local DB.
                String userId = userJson.optString("_id", null);
                getSharedPreferences("MyPrefs", MODE_PRIVATE)
                        .edit()
                        .putString("userID", userId)
                        .apply();
                labelViewModel.fetchLabels();
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
                R.id.nav_draft, R.id.nav_spam, R.id.nav_trash)
                .setOpenableLayout(drawer)
                .build();

        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_home);
        NavigationUI.setupActionBarWithNavController(this, navController, mAppBarConfiguration);
        NavigationUI.setupWithNavController(navigationView, navController);

        navigationView.setNavigationItemSelectedListener(item -> {
            int id = item.getItemId();
            if (id == R.id.nav_add_label) {
                LabelDialogHelper.showAddLabelDialog(this, labelViewModel, this);
                return true;
            }

            NavigationUI.onNavDestinationSelected(item, navController);
            drawer.closeDrawers();
            return true;
        });

        setupLabelsMenu();
        observeAndRenderLabels();
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

    // Renders the list of labels into the given container
    private void renderLabels(LinearLayout container, List<Label> labels, boolean enableEdit) {
        container.removeAllViews();

        for (Label label : labels) {
            View labelView = LayoutInflater.from(this).inflate(R.layout.item_label, container, false);

            TextView labelNameTextView = labelView.findViewById(R.id.labelNameTextView);
            ImageButton editButton = labelView.findViewById(R.id.editLabelButton);
            ImageButton deleteButton = labelView.findViewById(R.id.deleteLabelButton);

            labelNameTextView.setText(label.getName());

            labelNameTextView.setOnClickListener(v -> {
                Bundle args = new Bundle();
                args.putString("labelId", label.getId());
                args.putString("labelName", label.getName());

                NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_home);

                NavOptions navOptions = new NavOptions.Builder()
                        .setPopUpTo(R.id.nav_label_mails, true)
                        .setLaunchSingleTop(true)
                        .build();

                navController.navigate(R.id.nav_label_mails, args, navOptions);

                DrawerLayout drawer = this.findViewById(R.id.drawer_layout);
                drawer.closeDrawer(GravityCompat.START);
            });


            if (enableEdit) {
                editButton.setOnClickListener(v -> LabelDialogHelper.showEditLabelDialog(this, label, labelViewModel, this));
                deleteButton.setOnClickListener(v -> LabelDialogHelper.showDeleteLabelDialog(this, label, labelViewModel, this));
            } else {
                editButton.setVisibility(View.GONE);
                deleteButton.setVisibility(View.GONE);
            }

            container.addView(labelView);
        }
    }

    // Observes label data and renders them with edit/delete enabled
    private void observeAndRenderLabels() {
        LinearLayout labelsContainer = findViewById(R.id.labels_container);

        // Observe the LiveData from the ViewModel
        labelViewModel.getLabels().observe(this, labels -> renderLabels(labelsContainer, labels, true));
    }

    // Sets up the labels in the navigation drawer without edit/delete functionality
    private void setupLabelsMenu() {
        LinearLayout labelsContainer = findViewById(R.id.labels_container);

        if (labelsContainer == null) {
            Toast.makeText(this, "labels_container is missing", Toast.LENGTH_SHORT).show();
            return;
        }
        // Observe the labels and render them in the drawer without edit/delete buttons
        labelViewModel.getLabels().observe(this, labels -> renderLabels(labelsContainer, labels, false));
    }

    public void showEmptyTrashButton(boolean show) {
        Button btn = findViewById(R.id.btn_empty_trash);
        btn.setVisibility(show ? View.VISIBLE : View.GONE);
    }
}
