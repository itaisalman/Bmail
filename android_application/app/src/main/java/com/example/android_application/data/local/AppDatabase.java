package com.example.android_application.data.local;

import android.content.Context;
import androidx.annotation.NonNull;
import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import androidx.room.migration.Migration;
import androidx.sqlite.db.SupportSQLiteDatabase;
import com.example.android_application.data.local.dao.DraftDao;
import com.example.android_application.data.local.dao.MailDao;
import com.example.android_application.data.local.entity.Draft;
import com.example.android_application.data.local.entity.Mail;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Database(entities = {Draft.class, Mail.class}, version = 6) // Incremented version due to schema change
public abstract class AppDatabase extends RoomDatabase {
    public abstract DraftDao draftDao();
    public abstract MailDao mailDao();

    private static volatile AppDatabase INSTANCE;

    // Singleton pattern to get the database instance
    public static AppDatabase getDatabase(Context context) {
        if (INSTANCE == null) {
            synchronized (AppDatabase.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(context.getApplicationContext(),
                                    AppDatabase.class, "bmail_database")
                            .addMigrations(MIGRATION_1_2, MIGRATION_2_3, MIGRATION_3_4, MIGRATION_4_5, MIGRATION_5_6)
                            .fallbackToDestructiveMigration()
                            .build();
                }
            }
        }
        return INSTANCE;
    }

    public static final ExecutorService databaseWriteExecutor =
            Executors.newFixedThreadPool(4);

    static final Migration MIGRATION_1_2 = new Migration(1, 2) {
        @Override
        public void migrate(@NonNull SupportSQLiteDatabase database) {
            database.execSQL("ALTER TABLE drafts ADD COLUMN last_modified INTEGER NOT NULL DEFAULT 0");
        }
    };

    static final Migration MIGRATION_2_3 = new Migration(2, 3) {
        @Override
        public void migrate(@NonNull SupportSQLiteDatabase database) {
            database.execSQL(
                    "CREATE TABLE IF NOT EXISTS drafts_new (" +
                            "id TEXT NOT NULL PRIMARY KEY, " +
                            "`to` TEXT, " +
                            "subject TEXT, " +
                            "body TEXT, " +
                            "last_modified INTEGER NOT NULL DEFAULT 0)"
            );
            database.execSQL(
                    "INSERT INTO drafts_new (id, `to`, subject, body, last_modified) " +
                            "SELECT CAST(id AS TEXT), `to`, subject, body, last_modified FROM drafts"
            );
            database.execSQL("DROP TABLE drafts");
            database.execSQL("ALTER TABLE drafts_new RENAME TO drafts");
        }
    };

    static final Migration MIGRATION_3_4 = new Migration(3, 4) {
        @Override
        public void migrate(@NonNull SupportSQLiteDatabase database) {
            database.execSQL("ALTER TABLE drafts ADD COLUMN user_id TEXT");
        }
    };
    static final Migration MIGRATION_4_5 = new Migration(4, 5) {
        @Override
        public void migrate(@NonNull SupportSQLiteDatabase database) {
            database.execSQL(
                    "CREATE TABLE IF NOT EXISTS mails (" +
                            "id TEXT NOT NULL PRIMARY KEY, " +
                            "sender_id TEXT, " +
                            "sender_address TEXT, " +
                            "sender_first_name TEXT, " +
                            "sender_last_name TEXT, " +
                            "receiver_id TEXT, " +
                            "receiver_address TEXT, " +
                            "receiver_first_name TEXT, " +
                            "receiver_last_name TEXT, " +
                            "title TEXT, " +
                            "content TEXT, " +
                            "date TEXT)"
            );
        }
    };
    static final Migration MIGRATION_5_6 = new Migration(5, 6) {
        @Override
        public void migrate(@NonNull SupportSQLiteDatabase database) {
            database.execSQL("ALTER TABLE mails ADD COLUMN is_starred INTEGER NOT NULL DEFAULT 0");
        }
    };
}
