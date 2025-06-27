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
  const [currentPage, setCurrentPage] = useState(1);

  const {
    starredMails,
    importantMails,
    handleMailClick,
    handleDelete,
    setSelectedMail,
    selectedMail,
  } = useOutletContext();

  // Fetch spam data from the server for the current page
  const fetchSpam = useCallback(
    async (page = currentPage) => {
      try {
        const token = sessionStorage.getItem("jwt");

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

  // When user clicks empty trash button
  const RestoreFromSpam = async (id) => {
    setError("");

    try {
      const token = sessionStorage.getItem("jwt");
      const res = await fetch(`/api/mails/spam/${id}`, {
        method: "DELETE",
        headers: {
          authorization: "bearer " + token,
        },
      });

      if (!res.ok) throw new Error("Failed to remove from spam");

      // Updated values after delete all mails from user's trash
      setMessages((prev) => prev.filter((mail) => mail.id !== id));
      if (selectedMail?.id === id) setSelectedMail(null);
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
            onDelete={handleDelete}
            isSpamScreen={true}
            setMessages={setMessages}
          />
        </div>
      ) : (
        <MailDetails
          mail={selectedMail}
          onClose={() => setSelectedMail(null)}
          starred={starredMails}
          important={importantMails}
          onDelete={handleDelete}
          isSpamScreen={true}
          restore={RestoreFromSpam}
          setMessages={setMessages}
        />
      )}
    </div>
  );
}

export default SpamScreen;
