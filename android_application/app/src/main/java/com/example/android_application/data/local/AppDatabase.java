package com.example.android_application.data.local;

import android.content.Context;
import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import com.example.android_application.data.local.dao.DraftDao;
import com.example.android_application.data.local.entity.Draft;

@Database(entities = {Draft.class}, version = 1)
public abstract class AppDatabase extends RoomDatabase {
    public abstract DraftDao draftDao();

    private static volatile AppDatabase INSTANCE;
    // Get singleton database instance
    public static AppDatabase getDatabase(Context context) {
        if (INSTANCE == null) {
            synchronized (AppDatabase.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(context.getApplicationContext(),
                                    AppDatabase.class, "draft_database")
                            .fallbackToDestructiveMigration()
                            .build();
                }
            }
        }
        return INSTANCE;
    }
}
