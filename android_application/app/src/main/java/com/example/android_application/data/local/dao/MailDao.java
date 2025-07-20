package com.example.android_application.data.local.dao;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import androidx.room.Update;

import com.example.android_application.data.local.entity.Mail;

import java.util.List;

@Dao
public interface MailDao {

    @Query("SELECT * FROM mails")
    List<Mail> index();

    @Query("SELECT * FROM mails WHERE sender_address = :sender_address")
    List<Mail> getSent(String sender_address);

    @Query("SELECT * FROM mails WHERE receiver_address = :receiverAddress ORDER BY date DESC")
    LiveData<List<Mail>> getReceivedMailsLive(String receiverAddress);

    @Query("SELECT * FROM mails WHERE id = :id")
    Mail getMail(String id);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insert (List<Mail> mails);

    @Update
    void update (Mail... mails);

    @Delete
    void delete (Mail... mails);

}
