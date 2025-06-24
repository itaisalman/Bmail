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

  // Remove a draft from drafts array.
  const toggleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem("jwt");
      const delete_draft_res = await fetch(`/api/mails/draft/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: "bearer " + token,
        },
      });
      if (!delete_draft_res.ok) {
        setError("Communication error with the server");
        return;
      }
      // Success
      setError("");
      await fetchDraft();
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
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
          disabledActions={true}
        />
      </div>
      {showComposer && (
        <DraftMailComposer draft={selectedDraft} onClose={toggleComposer} />
      )}
    </div>
  );
}

export default Draft;
