package com.example.android_application.ui.draft;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.android_application.data.local.entity.Draft;
import com.example.android_application.data.repository.DraftRepository;

import java.util.List;

public class DraftViewModel extends AndroidViewModel {

    private final DraftRepository draftRepository;
    private final LiveData<List<Draft>> allDrafts;

    private int currentPage = 1;
    private boolean isLastPage = false;
    private boolean isLoading = false;
    private final MutableLiveData<Boolean> isLastPageLiveData = new MutableLiveData<>(false);

    public LiveData<Boolean> getIsLastPage() {
        return isLastPageLiveData;
    }

    public DraftViewModel(@NonNull Application application) {
        super(application);
        draftRepository = new DraftRepository(application);
        allDrafts = draftRepository.getAllDrafts();
    }

    public LiveData<List<Draft>> getAllDrafts() {
        return allDrafts;
    }

    /**
     * Load next page of drafts if not already loading or at last page.
     */
    public void loadNextPage() {
        if (isLoading || isLastPage) return;

        isLoading = true;
        draftRepository.getAllDraftsFromServer(currentPage, new DraftRepository.ApiCallback() {
            @Override
            public void onSuccess(int fetchedCount) {
                if (fetchedCount < DraftRepository.PAGE_SIZE) {
                    isLastPage = true;
                    isLastPageLiveData.postValue(true);
                } else {
                    currentPage++;
                }
                isLoading = false;
            }

            @Override
            public void onError(String error) {
                // You can log or handle errors here
                isLoading = false;
            }
        });
    }

    /**
     * Reset paging and reload from first page.
     */
    public void resetPaging() {
        currentPage = 1;
        isLastPage = false;
        loadNextPage();
    }
}
