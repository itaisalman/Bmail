package com.example.android_application.ui.home;

import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.view.Menu;
import android.widget.ImageButton;
import androidx.appcompat.widget.SearchView;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import com.example.android_application.ui.bottom_sheet.ComposeBottomSheet;
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

    private AppBarConfiguration mAppBarConfiguration;
    private ImageButton themeToggleDrawerHeader;

    private static final String ICON_STATE_KEY = "iconState";
    private boolean isDarkModeIconVisible = false;
    private boolean hasNavigatedToSearchResults = false;

    // ViewModel for managing search and related data
    private HomeViewModel homeViewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {


        super.onCreate(savedInstanceState);

        // Restore icon state
        if (savedInstanceState != null) {
            isDarkModeIconVisible = savedInstanceState.getBoolean(ICON_STATE_KEY, false);
        } else {
            int currentNightMode = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
            isDarkModeIconVisible = (currentNightMode == Configuration.UI_MODE_NIGHT_NO);
        }

        // View binding
        ActivityHomeBinding binding = ActivityHomeBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        // Initialize ViewModel
        homeViewModel = new ViewModelProvider(this).get(HomeViewModel.class);
        setSupportActionBar(binding.appBarHome.toolbar);
        binding.appBarHome.fab.setOnClickListener(view -> {
            ComposeBottomSheet composeSheet = new ComposeBottomSheet();
            composeSheet.show(getSupportFragmentManager(), "compose_bottom_sheet");
        });

        DrawerLayout drawer = binding.drawerLayout;
        NavigationView navigationView = binding.navView;

        homeViewModel.getUser();

        // Access drawer header
        View headerView = navigationView.getHeaderView(0);
        if (headerView != null) {
            themeToggleDrawerHeader = headerView.findViewById(R.id.themeToggleDrawerHeader);
            updateThemeToggleButtonIcon();

            themeToggleDrawerHeader.setOnClickListener(v -> {
                isDarkModeIconVisible = !isDarkModeIconVisible;
                updateThemeToggleButtonIcon();
            });

            // View user details
            TextView nameTextView = headerView.findViewById(R.id.nameTextView);
            TextView usernameTextView = headerView.findViewById(R.id.usernameTextView);
            ImageView profileImageView = headerView.findViewById(R.id.profileImageView);

            // Observe user details
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

            // Observe errors
            homeViewModel.error.observe(this, errorMessage -> {
                if (errorMessage != null) {
                    Toast.makeText(this, "error: " + errorMessage, Toast.LENGTH_SHORT).show();
                }
            });
        }

        // NavController settings
        mAppBarConfiguration = new AppBarConfiguration.Builder(
                R.id.nav_inbox, R.id.nav_star, R.id.nav_important, R.id.nav_sent,
                R.id.nav_draft, R.id.nav_spam)
                .setOpenableLayout(drawer)
                .build();

        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_home);
        NavigationUI.setupActionBarWithNavController(this, navController, mAppBarConfiguration);
        NavigationUI.setupWithNavController(navigationView, navController);
    }

    // Save the dark mode toggle state
    @Override
    protected void onSaveInstanceState(@NonNull Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putBoolean(ICON_STATE_KEY, isDarkModeIconVisible);
    }

    // Update the theme toggle icon based on the current mode
    private void updateThemeToggleButtonIcon() {
        if (themeToggleDrawerHeader != null) {
            if (isDarkModeIconVisible) {
                themeToggleDrawerHeader.setImageResource(R.drawable.ic_dark_mode);
            } else {
                themeToggleDrawerHeader.setImageResource(R.drawable.ic_light_mode);
            }
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.home, menu);

        MenuItem searchItem = menu.findItem(R.id.action_search);
        SearchView searchView = (SearchView) searchItem.getActionView();

        if (searchView != null) {
            searchView.setMaxWidth(Integer.MAX_VALUE);

            searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
                @Override
                public boolean onQueryTextSubmit(String query) {
                    searchView.clearFocus();
                    return true;
                }

                @Override
                public boolean onQueryTextChange(String newText) {
                    String token = getSharedPreferences("auth", MODE_PRIVATE).getString("jwt", null);

                    if (token == null) {
                        // No token - maybe user logged out; just clear results if needed
                        homeViewModel.clearSearchResults();
                        return true;
                    }

                    String trimmedText = newText.trim();
                    if (trimmedText.isEmpty()) {
                        homeViewModel.clearSearchResults();
                        return true;
                    }

                    // Trigger search
                    homeViewModel.searchMails(token, trimmedText);

                    // Navigate to search results only once per search session
                    NavController navController = Navigation.findNavController(
                            HomeActivity.this,
                            R.id.nav_host_fragment_content_home
                    );

                    if (!hasNavigatedToSearchResults &&
                            navController.getCurrentDestination() != null &&
                            navController.getCurrentDestination().getId() != R.id.searchResultsFragment) {

                        navController.navigate(R.id.action_global_searchResultsFragment);
                        hasNavigatedToSearchResults = true;
                    }

                    return true;
                }
            });

            // Reset navigation flag when search is closed/collapsed
            searchItem.setOnActionExpandListener(new MenuItem.OnActionExpandListener() {
                @Override
                public boolean onMenuItemActionExpand(MenuItem item) {
                    // Search opened - reset navigation flag to allow navigation next time
                    hasNavigatedToSearchResults = false;
                    return true;
                }

                @Override
                public boolean onMenuItemActionCollapse(MenuItem item) {
                    // Search closed - clear search results and reset navigation flag
                    homeViewModel.clearSearchResults();
                    hasNavigatedToSearchResults = false;
                    return true;
                }
            });
        }

        return true;
    }




    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.action_search) {
            // Search
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

    @Override
    public boolean onSupportNavigateUp() {
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_home);
        return NavigationUI.navigateUp(navController, mAppBarConfiguration)
                || super.onSupportNavigateUp();
    }
}