package com.example.android_application.data.local;

import android.content.Context;
import androidx.annotation.NonNull;
import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import androidx.room.TypeConverters;
import androidx.room.migration.Migration;
import androidx.sqlite.db.SupportSQLiteDatabase;
import com.example.android_application.data.local.dao.DraftDao;
import com.example.android_application.data.local.dao.MailDao;
import com.example.android_application.data.local.entity.Converters;
import com.example.android_application.data.local.entity.Draft;
import com.example.android_application.data.local.entity.Mail;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import com.example.android_application.data.local.entity.Label;
import com.example.android_application.data.local.dao.LabelDao;

@Database(entities = {Draft.class, Label.class, Mail.class}, version = 12) // Incremented version due to schema change
@TypeConverters({Converters.class})
public abstract class AppDatabase extends RoomDatabase {
    public abstract DraftDao draftDao();
    public abstract MailDao mailDao();
    public abstract LabelDao labelDao();

    private static volatile AppDatabase INSTANCE;

    // Singleton pattern to get the database instance
    public static AppDatabase getDatabase(Context context) {
        if (INSTANCE == null) {
            synchronized (AppDatabase.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(context.getApplicationContext(),
                                    AppDatabase.class, "bmail_database")
                            .fallbackToDestructiveMigration()
                            .build();
                }
            }
        }
        return INSTANCE;
    }

    public static final ExecutorService databaseWriteExecutor =
            Executors.newFixedThreadPool(4);

}