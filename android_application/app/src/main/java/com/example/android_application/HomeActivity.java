package com.example.android_application;

import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.os.Bundle;
import android.view.View;
import android.view.Menu;
import android.widget.ImageButton;

import com.google.android.material.snackbar.Snackbar;
import com.google.android.material.navigation.NavigationView;

import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate; // Import for theme switching

import com.example.android_application.databinding.ActivityHomeBinding;

public class HomeActivity extends AppCompatActivity {

    private AppBarConfiguration mAppBarConfiguration;
    // Renamed for clarity and consistency
    private ImageButton themeToggleDrawerHeader;
    private SharedPreferences sharedPreferences;
    private static final String PREFS_NAME = "ThemePrefs";
    private static final String THEME_KEY = "currentTheme";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        sharedPreferences = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        int savedThemeMode = sharedPreferences.getInt(THEME_KEY, AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
        AppCompatDelegate.setDefaultNightMode(savedThemeMode);

        super.onCreate(savedInstanceState);

        ActivityHomeBinding binding = ActivityHomeBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        setSupportActionBar(binding.appBarHome.toolbar);
        binding.appBarHome.fab.setOnClickListener(view -> Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                .setAction("Action", null)
                .setAnchorView(R.id.fab).show());

        DrawerLayout drawer = binding.drawerLayout;
        NavigationView navigationView = binding.navView;

        // Get the header view from the NavigationView
        View headerView = navigationView.getHeaderView(0);
        if (headerView != null) { // Always check if headerView is not null
            themeToggleDrawerHeader = headerView.findViewById(R.id.themeToggleDrawerHeader);
            updateThemeToggleButtonIcon();

            themeToggleDrawerHeader.setOnClickListener(v -> toggleTheme());
        }

        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        mAppBarConfiguration = new AppBarConfiguration.Builder(
                R.id.nav_home, R.id.nav_gallery, R.id.nav_slideshow)
                .setOpenableLayout(drawer)
                .build();
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_home);
        NavigationUI.setupActionBarWithNavController(this, navController, mAppBarConfiguration);
        NavigationUI.setupWithNavController(navigationView, navController);
    }

    private void toggleTheme() {
        // Get the current night mode setting
        int currentNightMode = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
        int newThemeMode;

        if (currentNightMode == Configuration.UI_MODE_NIGHT_YES) {
            // Currently in dark mode, switch to light mode
            newThemeMode = AppCompatDelegate.MODE_NIGHT_NO;
        } else {
            // Currently in light mode, switch to dark mode
            newThemeMode = AppCompatDelegate.MODE_NIGHT_YES;
        }

        // Save the new theme using SharedPreferences
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putInt(THEME_KEY, newThemeMode);
        // Use apply() for asynchronous saving
        editor.apply();

        // Set the new theme globally for the application
        AppCompatDelegate.setDefaultNightMode(newThemeMode);

        // Recreate the activity for the theme change to take effect immediately
        recreate();
    }

    private void updateThemeToggleButtonIcon() {
        // Check if the button object is not null before trying to set its image
        if (themeToggleDrawerHeader != null) {
            int currentNightMode = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
            if (currentNightMode == Configuration.UI_MODE_NIGHT_YES) {
                // Dark mode is active, show the light mode icon (to switch to light)
                themeToggleDrawerHeader.setImageResource(R.drawable.ic_light_mode);
            } else {
                // Light mode is active, show the dark mode icon (to switch to dark)
                themeToggleDrawerHeader.setImageResource(R.drawable.ic_dark_mode);
            }
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.home, menu);
        return true;
    }

    @Override
    public boolean onSupportNavigateUp() {
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_home);
        return NavigationUI.navigateUp(navController, mAppBarConfiguration)
                || super.onSupportNavigateUp();
    }
}