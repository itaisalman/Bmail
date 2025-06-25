import { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import "../Inbox/Inbox.css";
import MailList from "../MailList/MailList";
import MailDetails from "../ViewMail/ViewMail";
import MailsControl from "../MailsControl/MailsControl";

function TrashScreen() {
  // State variables for inbox data and UI state
  const [messages, setMessages] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState("");
  const [selectedMail, setSelectedMail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    handleStarToggle,
    handleImportantToggle,
    handleDelete,
    starredMails,
    importantMails,
    moveToSpam,
  } = useOutletContext();

  // Fetch inbox data from the server for the current page
  const fetchTrash = useCallback(
    async (page = currentPage) => {
      try {
        const token = sessionStorage.getItem("jwt");
        if (!token) return;

        const res = await fetch(`/api/mails?page=${page}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: "bearer " + token,
            label: "Trash",
          },
        });

        if (!res.ok) throw new Error("Failed to load trash");
        const data = await res.json();
        setMessages(data.mails);
        setTotalCount(data.totalCount);
        setError("");
      } catch (err) {
        setError("Failed to load trash");
      }
    },
    [currentPage]
  );

  // Fetch inbox whenever the page changes
  useEffect(() => {
    fetchTrash(currentPage);
  }, [fetchTrash, currentPage]);

  // Load and show the full details of a selected mail
  const handleMailClick = async (id) => {
    if (!id) return;
    const token = sessionStorage.getItem("jwt");
    const res = await fetch(`/api/mails/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setSelectedMail(data);
  };

  // When user clicks empty trash button
  const handleEmptyTrash = async () => {
    setError("");

    try {
      const token = sessionStorage.getItem("jwt");
      if (!token) return;
      const res = await fetch("/api/mails/trash", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: "bearer " + token,
        },
      });

      if (!res.ok) throw new Error("Failed to empty trash");

      // Updated values after delete all mails from user's trash
      setSelectedMail(null);
      setMessages([]);
      setTotalCount(0);
      setCurrentPage(1);
    } catch (err) {
      setError("Failed empty trash");
    }
  };

  const handleMoveToSpam = async (id) => {
    await moveToSpam(id);
    setMessages((prev) => prev.filter((mail) => mail.id !== id));
    if (selectedMail?.id === id) {
      setSelectedMail(null);
    }
  };

  return (
    <div className="inboxScreen">
      {!selectedMail && (
        <MailsControl
          currentPage={currentPage}
          totalCount={totalCount}
          onRefresh={fetchTrash}
          onPageChange={setCurrentPage}
          onEmptyTrash={handleEmptyTrash}
        />
      )}

      {error && <p className="error-message">{error}</p>}

      {!selectedMail ? (
        <div className="inbox-body">
          <MailList
            mails={messages}
            starred={starredMails}
            important={importantMails}
            onSelect={handleMailClick}
            onStarToggle={handleStarToggle}
            onImportantToggle={handleImportantToggle}
            onDelete={handleDelete}
            disabledActions={true}
          />
        </div>
      ) : (
        <MailDetails
          mail={selectedMail}
          onClose={() => setSelectedMail(null)}
          onStarToggle={handleStarToggle}
          onImportantToggle={handleImportantToggle}
          onDelete={handleDelete}
          starred={starredMails}
          important={importantMails}
          moveToSpam={handleMoveToSpam}
          disabledActions={true}
        />
      )}
    </div>
  );
}

export default TrashScreen;
