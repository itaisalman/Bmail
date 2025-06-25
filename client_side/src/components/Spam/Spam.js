import { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import "../Inbox/Inbox.css";
import MailList from "../MailList/MailList";
import MailDetails from "../ViewMail/ViewMail";
import MailsControl from "../MailsControl/MailsControl";

function SpamScreen() {
  // State variables for spam data and UI state
  const [messages, setMessages] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState("");
  const [selectedMail, setSelectedMail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    starredMails,
    importantMails,
    toggleStar,
    toggleImportant,
    deleteMail,
  } = useOutletContext();

  // Fetch spam data from the server for the current page
  const fetchSpam = useCallback(
    async (page = currentPage) => {
      try {
        const token = sessionStorage.getItem("jwt");
        if (!token) return;

        const res = await fetch(`/api/mails?page=${page}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: "bearer " + token,
            label: "Spam",
          },
        });

        if (!res.ok) throw new Error("Failed to load spam");
        setError("");
        const data = await res.json();
        setMessages(data.mails);
        setTotalCount(data.totalCount);
      } catch (err) {
        setError(err.message);
      }
    },
    [currentPage]
  );

  // Fetch spam whenever the page changes
  useEffect(() => {
    fetchSpam(currentPage);
  }, [fetchSpam, currentPage]);

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

  const handleDelete = async (id) => {
    await deleteMail(id);
    setMessages((prev) => prev.filter((mail) => mail.id !== id));
    if (selectedMail?.id === id) setSelectedMail(null);
  };

  return (
    <div className="inboxScreen">
      {!selectedMail && (
        <MailsControl
          currentPage={currentPage}
          totalCount={totalCount}
          onRefresh={fetchSpam}
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
            onDelete={handleDelete}
            isSpamScreen={true}
          />
        </div>
      ) : (
        <MailDetails
          mail={selectedMail}
          onClose={() => setSelectedMail(null)}
          onStarToggle={toggleStar}
          onImportantToggle={toggleImportant}
          onDelete={handleDelete}
          starred={starredMails}
          important={importantMails}
          isSpamScreen={true}
        />
      )}
    </div>
  );
}

export default SpamScreen;
