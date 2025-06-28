import { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import "../Inbox/Inbox.css";
import MailList from "../MailList/MailList";
import MailDetails from "../ViewMail/ViewMail";
import MailsControl from "../MailsControl/MailsControl";

function StarredScreen() {
  const [messages, setMessages] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    starredMails,
    importantMails,
    toggleStar,
    toggleImportant,
    handleDelete,
    handleMoveToSpam,
    handleMailClick,
    setSelectedMail,
    selectedMail,
  } = useOutletContext();

  // Fetch starred mails from the server for the current page
  const fetchStarred = useCallback(
    async (page = currentPage) => {
      try {
        const token = sessionStorage.getItem("jwt");

        const res = await fetch(`/api/mails?page=${page}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: "bearer " + token,
            label: "Starred",
          },
        });

        if (!res.ok) throw new Error("Failed to load starred");
        setError("");
        const data = await res.json();
        setMessages(data.mails);
        setTotalCount(data.totalCount);
      } catch (err) {
        setError("Failed to load starred");
      }
    },
    [currentPage]
  );

  // Fetch starred whenever the page changes
  useEffect(() => {
    fetchStarred(currentPage);
  }, [fetchStarred, currentPage]);

  const handleStarToggle = async (id) => {
    await toggleStar(id);
    // Remove mail localy
    setMessages((prev) => prev.filter((mail) => mail.id !== id));
    if (selectedMail?.id === id) setSelectedMail(null);
  };

  return (
    <div className="inboxScreen">
      {!selectedMail && (
        <MailsControl
          currentPage={currentPage}
          totalCount={totalCount}
          onRefresh={fetchStarred}
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
            onStarToggle={handleStarToggle}
            onImportantToggle={toggleImportant}
            onDelete={handleDelete}
            setMessages={setMessages}
          />
        </div>
      ) : (
        <MailDetails
          mail={selectedMail}
          onClose={() => setSelectedMail(null)}
          onStarToggle={handleStarToggle}
          onImportantToggle={toggleImportant}
          onDelete={handleDelete}
          moveToSpam={handleMoveToSpam}
          starred={starredMails}
          important={importantMails}
          setMessages={setMessages}
        />
      )}
    </div>
  );
}

export default StarredScreen;
