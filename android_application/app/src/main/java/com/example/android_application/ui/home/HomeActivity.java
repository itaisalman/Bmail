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

import com.example.android_application.databinding.ActivityHomeBinding;

public class HomeActivity extends AppCompatActivity {

    private AppBarConfiguration mAppBarConfiguration;
    private ImageButton themeToggleDrawerHeader;
    private static final String ICON_STATE_KEY = "iconState";
    private boolean isDarkModeIconVisible = false;

    // ViewModel for managing search and related data
    private HomeViewModel homeViewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Restore dark mode toggle state or detect current mode
        if (savedInstanceState != null) {
            isDarkModeIconVisible = savedInstanceState.getBoolean(ICON_STATE_KEY, false);
        } else {
            int currentNightMode = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
            isDarkModeIconVisible = (currentNightMode == Configuration.UI_MODE_NIGHT_NO);
        }

        ActivityHomeBinding binding = ActivityHomeBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        // Initialize ViewModel
        homeViewModel = new ViewModelProvider(this).get(HomeViewModel.class);
        setSupportActionBar(findViewById(R.id.toolbar));
        binding.appBarHome.fab.setOnClickListener(view -> {
            ComposeBottomSheet composeSheet = new ComposeBottomSheet();
            composeSheet.show(getSupportFragmentManager(), "compose_bottom_sheet");
        });

        DrawerLayout drawer = binding.drawerLayout;
        NavigationView navigationView = binding.navView;

        // Setup theme toggle button in navigation drawer header
        View headerView = navigationView.getHeaderView(0);
        if (headerView != null) {
            themeToggleDrawerHeader = headerView.findViewById(R.id.themeToggleDrawerHeader);
            updateThemeToggleButtonIcon();

            themeToggleDrawerHeader.setOnClickListener(v -> {
                isDarkModeIconVisible = !isDarkModeIconVisible;
                updateThemeToggleButtonIcon();
            });
        }

        mAppBarConfiguration = new AppBarConfiguration.Builder(
                R.id.nav_home, R.id.nav_gallery, R.id.nav_slideshow)
                .setOpenableLayout(drawer)
                .build();

        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_home);
        NavigationUI.setupActionBarWithNavController(this, navController, mAppBarConfiguration);
        NavigationUI.setupWithNavController(navigationView, navController);
    }

    @Override
    protected void onSaveInstanceState(@NonNull Bundle outState) {
        super.onSaveInstanceState(outState);
        // Save the dark mode toggle state
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

            // Listen for search submit and text change to trigger search via ViewModel
            searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
                @Override
                public boolean onQueryTextSubmit(String query) {
                    SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
                    String token = prefs.getString("jwt", null);

                    if (token != null && !query.trim().isEmpty()) {
                        homeViewModel.searchMails(token, query.trim());
                    }

                    searchView.clearFocus();
                    return true;
                }

                @Override
                public boolean onQueryTextChange(String newText) {
                    SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
                    String token = prefs.getString("jwt", null);

                    if (token != null && !newText.trim().isEmpty()) {
                        homeViewModel.searchMails(token, newText.trim());
                    }
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
            return true;
        } else if (id == R.id.action_logout) {
            SharedPreferences prefs = getSharedPreferences("MyPrefs", MODE_PRIVATE);
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
