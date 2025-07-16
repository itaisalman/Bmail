package com.example.android_application.ui.home;

import android.content.res.Configuration;
import android.os.Bundle;
import android.view.View;
import android.view.Menu;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import com.bumptech.glide.Glide;
import com.example.android_application.R;
import com.example.android_application.databinding.ActivityHomeBinding;
import com.example.android_application.ui.bottom_sheet.ComposeBottomSheet;
import com.google.android.material.navigation.NavigationView;

public class HomeActivity extends AppCompatActivity {

    private HomeViewModel viewModel;

    private AppBarConfiguration mAppBarConfiguration;
    private ImageButton themeToggleDrawerHeader;

    private static final String ICON_STATE_KEY = "iconState";
    private boolean isDarkModeIconVisible = false;

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

        setSupportActionBar(binding.appBarHome.toolbar);

        // Floating Action Button
        binding.appBarHome.fab.setOnClickListener(view -> {
            ComposeBottomSheet composeSheet = new ComposeBottomSheet();
            composeSheet.show(getSupportFragmentManager(), "compose_bottom_sheet");
        });

        DrawerLayout drawer = binding.drawerLayout;
        NavigationView navigationView = binding.navView;

        // Init ViewModel
        viewModel = new ViewModelProvider(this).get(HomeViewModel.class);
        viewModel.getUser();

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
            viewModel.user.observe(this, userJson -> {
                String firstName = userJson.optString("first_name", "");
                String lastName = userJson.optString("last_name", "");
                String username = userJson.optString("username", "");
                String profilePath = userJson.optString("image", "");
                String profileUrl = "http://10.0.2.2:3000/" + profilePath;

                nameTextView.setText(firstName + " " + lastName);
                usernameTextView.setText(username);

                Glide.with(this).load(profileUrl).circleCrop().into(profileImageView);
            });

            // Observe errors
            viewModel.error.observe(this, errorMessage -> {
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
