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
    private LiveData<List<Draft>> allDrafts;

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
    }

    // Load drafts from local DB for given user.
    public void loadDraftsForUser(String userId) {
        allDrafts = draftRepository.getAllDrafts(userId);
    }

    public LiveData<List<Draft>> getAllDrafts() {
        return allDrafts;
    }

    // Fetches the next page from server if not already loading or last page.
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
                isLoading = false;
            }
        });
    }

    // Fetch first page and reset pagination state.
    public void fetchDraftsFromServer() {
        draftRepository.getAllDraftsFromServer(1, new DraftRepository.ApiCallback() {
            @Override
            public void onSuccess(int fetchedCount) {
                currentPage = 2;
                isLastPage = fetchedCount < DraftRepository.PAGE_SIZE;
                isLastPageLiveData.postValue(isLastPage);
            }

            @Override
            public void onError(String error) {
                // Optional: expose error LiveData or log
            }
        });
    }
}
