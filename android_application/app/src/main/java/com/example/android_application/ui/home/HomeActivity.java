package com.example.android_application.ui.home;

import android.content.res.Configuration;
import android.os.Bundle;
import android.view.View;
import android.view.Menu;
import android.widget.ImageButton;

import com.google.android.material.snackbar.Snackbar;
import com.google.android.material.navigation.NavigationView;
import com.example.android_application.R;
import androidx.annotation.NonNull;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.appcompat.app.AppCompatActivity;

import com.example.android_application.databinding.ActivityHomeBinding;

public class HomeActivity extends AppCompatActivity {

    private AppBarConfiguration mAppBarConfiguration;
    private ImageButton themeToggleDrawerHeader;

    private static final String ICON_STATE_KEY = "iconState";
    private boolean isDarkModeIconVisible = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {


        super.onCreate(savedInstanceState);

        if (savedInstanceState != null) {
            isDarkModeIconVisible = savedInstanceState.getBoolean(ICON_STATE_KEY, false);
        } else {
            int currentNightMode = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
            isDarkModeIconVisible = (currentNightMode == Configuration.UI_MODE_NIGHT_NO);
        }

        ActivityHomeBinding binding = ActivityHomeBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        setSupportActionBar(binding.appBarHome.toolbar);
        binding.appBarHome.fab.setOnClickListener(view -> Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                .setAction("Action", null)
                .setAnchorView(R.id.fab).show());

        DrawerLayout drawer = binding.drawerLayout;
        NavigationView navigationView = binding.navView;

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
        outState.putBoolean(ICON_STATE_KEY, isDarkModeIconVisible);
    }

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
        return true;
    }

    @Override
    public boolean onSupportNavigateUp() {
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_home);
        return NavigationUI.navigateUp(navController, mAppBarConfiguration)
                || super.onSupportNavigateUp();
    }
}