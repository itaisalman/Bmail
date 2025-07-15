package com.example.android_application.data.local.dao;

import androidx.lifecycle.LiveData;
import androidx.room.*;

import com.example.android_application.data.local.entity.Draft;

import java.util.List;

@Dao
public interface DraftDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insert(Draft draft);

    @Delete
    void delete(Draft draft);

    @Query("SELECT * FROM drafts ORDER BY id DESC")
    LiveData<List<Draft>> getAllDrafts();
}
