package com.example.android_application.data.local.dao;

import androidx.lifecycle.LiveData;
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

    @Query("SELECT * FROM mails WHERE sender_address = :sender_address AND is_trash = 0 ORDER BY date DESC")
    LiveData<List<Mail>> getSentMailsLive(String sender_address);

    @Query("SELECT * FROM mails WHERE receiver_address = :receiverAddress AND is_trash = 0 ORDER BY date DESC")
    LiveData<List<Mail>> getReceivedMailsLive(String receiverAddress);

    @Query("SELECT * FROM mails WHERE is_starred = 1 AND is_trash = 0 AND (receiver_address = :mailAddress OR sender_address = :mailAddress) ORDER BY date DESC")
    LiveData<List<Mail>> getStarredMails(String mailAddress);

    @Query("SELECT * FROM mails WHERE is_important = 1 AND is_trash = 0 AND (receiver_address = :mailAddress OR sender_address = :mailAddress) ORDER BY date DESC")
    LiveData<List<Mail>> getImportantMails(String mailAddress);

    @Query("SELECT * FROM mails WHERE is_trash = 1 AND (receiver_address = :mailAddress OR sender_address = :mailAddress) ORDER BY date DESC")
    LiveData<List<Mail>> getTrashMailsLive(String mailAddress);

    @Query("SELECT * FROM mails WHERE id = :mailId LIMIT 1")
    LiveData<Mail> getMailByIdLive(String mailId);

    @Query("SELECT * FROM mails WHERE id = :mailId LIMIT 1")
    Mail getMailById(String mailId);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insert (List<Mail> mails);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertMail(Mail mail);

    @Update
    void updateMail(Mail mail);

    @Delete
    void delete (Mail... mails);

    @Query("SELECT * FROM mails WHERE id IN (:mailIds) ORDER BY date DESC")
    LiveData<List<Mail>> getMailsByIds(List<String> mailIds);
}
