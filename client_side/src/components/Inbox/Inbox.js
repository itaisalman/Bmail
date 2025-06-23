import { useEffect, useState, useCallback } from "react";
import "../Inbox/Inbox.css";
import MailList from "../MailList/MailList";
import MailDetails from "../ViewMail/ViewMail";
import MailsControl from "../MailsControl/MailsControl";

function InboxScreen() {
  // State variables for inbox data and UI state
  const [messages, setMessages] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState("");
  const [starredMails, setStarredMails] = useState(new Set());
  const [importantMails, setImportantMails] = useState(new Set());
  const [selectedMail, setSelectedMail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch inbox data from the server for the current page
  const fetchInbox = useCallback(
    async (page = currentPage) => {
      try {
        const token = sessionStorage.getItem("jwt");
        if (!token) return;

        const res = await fetch(`/api/mails?page=${page}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: "bearer " + token,
            label: "Inbox",
          },
        });

        if (!res.ok) throw new Error("Failed to load inbox");
        setError("");
        const data = await res.json();
        setMessages(data.mails);
        setTotalCount(data.totalCount);
      } catch (err) {
        setError("Error loading inbox: " + err.message);
      }
    },
    [currentPage]
  );

  // Fetch inbox whenever the page changes
  useEffect(() => {
    fetchInbox(currentPage);
  }, [fetchInbox, currentPage]);

  // Load and show the full details of a selected mail
  const handleMailClick = async (id) => {
    const token = sessionStorage.getItem("jwt");
    const res = await fetch(`/api/mails/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setSelectedMail(data);
  };

  // Toggle star/unstar a mail by ID
  const toggleStar = async (id) => {
    try {
      const token = sessionStorage.getItem("jwt");
      if (!token) return;
      const res = await fetch(`/api/mails/star/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: "bearer " + token,
        },
      });
      if (!res.ok) throw new Error("Failed to update star");

      setStarredMails((prev) => {
        const newSet = new Set(prev);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
        return newSet;
      });
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  // Toggle mark/unmark a mail as important
  const toggleImportant = async (id) => {
    try {
      const token = sessionStorage.getItem("jwt");
      if (!token) return;
      const res = await fetch(`/api/mails/important/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: "bearer " + token,
        },
      });
      if (!res.ok) throw new Error("Failed to update important");

      setImportantMails((prev) => {
        const newSet = new Set(prev);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
        return newSet;
      });
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  // Remove a mail from the current list and unmark it from starred/important
  const toggleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem("jwt");
      if (!token) return;

      // Delete request to server
      const res = await fetch(`/api/mails/${id}`, {
        method: "DELETE",
        headers: {
          authorization: "bearer " + token,
        },
      });

      if (!res.ok) throw new Error("Failed to delete mail");
      setError("");

      // local update after delete from server
      setMessages((prev) => prev.filter((mail) => mail.id !== id));
      setStarredMails((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      setImportantMails((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      if (selectedMail?.id === id) {
        setSelectedMail(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="inboxScreen">
      {!selectedMail && (
        <MailsControl
          currentPage={currentPage}
          totalCount={totalCount}
          onRefresh={fetchInbox}
          onPageChange={setCurrentPage}
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
            onStarToggle={toggleStar}
            onImportantToggle={toggleImportant}
            onDelete={toggleDelete}
          />
        </div>
      ) : (
        <MailDetails
          mail={selectedMail}
          onClose={() => setSelectedMail(null)}
          onStarToggle={toggleStar}
          onImportantToggle={toggleImportant}
          onDelete={toggleDelete}
          starred={starredMails}
          important={importantMails}
        />
      )}
    </div>
  );
}

export default InboxScreen;
