package com.example.android_application.data.local.dao;

import androidx.lifecycle.LiveData;
import androidx.room.*;

import com.example.android_application.data.local.entity.Draft;

import java.util.List;

@Dao
public interface DraftDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insert(Draft draft);

    @Query("DELETE FROM drafts WHERE id = :draftId")
    void deleteById(String draftId);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertDrafts(List<Draft> drafts);

    @Query("SELECT * FROM drafts WHERE user_id = :userId ORDER BY last_modified")
    LiveData<List<Draft>> getAllDrafts(String userId);
}
