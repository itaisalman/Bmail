package com.example.android_application.data.local.dao;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import androidx.room.Update;

import com.example.android_application.data.local.entity.Label;

import java.util.List;

@Dao
public interface LabelDao {

    @Query("SELECT * FROM labels")
    LiveData<List<Label>> getAllLabels();

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertLabel(Label label);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertAll(List<Label> labels);

    @Update
    void updateLabel(Label label);

    @Delete
    void deleteLabel(Label label);

    @Query("DELETE FROM labels WHERE id = :labelId")
    void deleteById(String labelId);

}
