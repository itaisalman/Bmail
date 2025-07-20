package com.example.android_application.data.local;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import androidx.room.migration.Migration;
import androidx.sqlite.db.SupportSQLiteDatabase;

import com.example.android_application.data.local.dao.DraftDao;
import com.example.android_application.data.local.entity.Draft;
import com.example.android_application.data.local.entity.Label;
import com.example.android_application.data.local.dao.LabelDao;

@Database(entities = {Draft.class, Label.class}, version = 3) // Incremented version due to schema change
public abstract class AppDatabase extends RoomDatabase {
    public abstract DraftDao draftDao();

    public abstract LabelDao labelDao();

    private static volatile AppDatabase INSTANCE;

    // Singleton pattern to get the database instance
    public static AppDatabase getDatabase(Context context) {
        if (INSTANCE == null) {
            synchronized (AppDatabase.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(context.getApplicationContext(),
                                    AppDatabase.class, "draft_database")
                            .addMigrations(MIGRATION_1_2, MIGRATION_2_3)
                            .build();
                }
            }
        }
        return INSTANCE;
    }
    static final Migration MIGRATION_1_2 = new Migration(1, 2) {
        @Override
        public void migrate(@NonNull SupportSQLiteDatabase database) {
            database.execSQL("ALTER TABLE drafts ADD COLUMN last_modified INTEGER NOT NULL DEFAULT 0");
        }
    };
    static final Migration MIGRATION_2_3 = new Migration(2, 3) {
        @Override
        public void migrate(@NonNull SupportSQLiteDatabase database) {
            database.execSQL("CREATE TABLE IF NOT EXISTS `labels` (`_id` TEXT NOT NULL, `name` TEXT, PRIMARY KEY(`_id`))");
        }
    };

}
