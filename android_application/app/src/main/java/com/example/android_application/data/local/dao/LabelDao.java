package com.example.android_application.data.local.dao;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import androidx.room.Update;
import com.example.android_application.data.local.entity.Label;
import java.util.List;

@Dao
public interface LabelDao {
    @Query("SELECT * FROM labels WHERE user_id = :userId ORDER BY name ASC")
    LiveData<List<Label>> getAllLabels(String userId);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertLabel(Label label);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertAll(List<Label> labels);

    @Update
    void updateLabel(Label label);

    @Query("DELETE FROM labels WHERE id = :labelId")
    void deleteById(String labelId);


}
