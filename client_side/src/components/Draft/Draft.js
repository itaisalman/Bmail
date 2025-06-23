import DraftMailComposer from "../DraftMailComposer/DraftMailComposer";
import MailsControl from "../MailsControl/MailsControl";
import { useEffect, useState, useCallback } from "react";
import MailList from "../MailList/MailList";
import "./Draft.css";

function Draft() {
  const [drafts, setDrafts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [showComposer, setShowComposer] = useState(false);

  const toggleComposer = async () => {
    setShowComposer((prev) => !prev);
    await fetchDraft();
  };

  // Fetch inbox data from the server for the current page
  const fetchDraft = useCallback(
    async (page = currentPage) => {
      try {
        const token = sessionStorage.getItem("jwt");
        if (!token) return;

        const res = await fetch(`/api/mails?page=${page}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: "bearer " + token,
            label: "Draft",
          },
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error);
          return;
        }
        setDrafts(data.mails);
        setTotalCount(data.totalCount);
      } catch (err) {
        setError("Error loading draft: " + err.message);
      }
    },
    [currentPage]
  );
  // Fetch drafts whenever the page changes
  useEffect(() => {
    fetchDraft();
  }, [fetchDraft]);

  // useEffect(() => {
  //   if (!showComposer) {
  //     fetchDraft(currentPage); // explicitly pass latest page
  //   }
  // }, [showComposer, fetchDraft, currentPage]);

  // Load and show the full details of a selected mail
  const handleMailClick = async (id) => {
    const token = sessionStorage.getItem("jwt");
    const res = await fetch(`/api/mails/draft/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to fetch draft");
      return;
    }
    setSelectedDraft(data);
    setShowComposer((prev) => !prev);
  };

  // Remove a mail from the current list and unmark it from starred/important
  const toggleDelete = (id) => {
    setDrafts((prev) => prev.filter((draft) => draft.id !== id));
    if (selectedDraft?.id === id) {
      setSelectedDraft(null);
    }
  };

  return (
    <div className="inboxScreen">
      <MailsControl
        currentPage={currentPage}
        totalCount={totalCount}
        onRefresh={fetchDraft}
        onPageChange={setCurrentPage}
      />

      {error && <p className="error-message">{error}</p>}

      <div className="inbox-body">
        <MailList
          mails={drafts}
          onSelect={handleMailClick}
          onDelete={toggleDelete}
        />
      </div>
      {showComposer && (
        <DraftMailComposer draft={selectedDraft} onClose={toggleComposer} />
      )}
    </div>
  );
}

export default Draft;
