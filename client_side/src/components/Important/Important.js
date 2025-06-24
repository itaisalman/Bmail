import { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import "../Inbox/Inbox.css";
import MailList from "../MailList/MailList";
import MailDetails from "../ViewMail/ViewMail";
import MailsControl from "../MailsControl/MailsControl";

function ImportantScreen() {
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
  const fetchImportant = useCallback(
    async (page = currentPage) => {
      try {
        const token = sessionStorage.getItem("jwt");
        if (!token) return;

        const res = await fetch(`/api/mails?page=${page}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: "bearer " + token,
            label: "Important",
          },
        });

        if (!res.ok) throw new Error("Failed to load important mails");

        const data = await res.json();
        setMessages(data.mails);
        setTotalCount(data.totalCount);
        setError("");
      } catch (err) {
        setError(err.message);
      }
    },
    [currentPage]
  );

  useEffect(() => {
    fetchImportant();
  }, [fetchImportant]);

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

  const handleImportantToggle = async (id) => {
    await toggleImportant(id);
    // Remove mail localy
    setMessages((prev) => prev.filter((mail) => mail.id !== id));
    if (selectedMail?.id === id) setSelectedMail(null);
  };

  // Delete the mail from all labels
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
          onRefresh={fetchImportant}
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
            onImportantToggle={handleImportantToggle}
            onDelete={handleDelete}
          />
        </div>
      ) : (
        <MailDetails
          mail={selectedMail}
          onClose={() => setSelectedMail(null)}
          onStarToggle={toggleStar}
          onImportantToggle={handleImportantToggle}
          onDelete={handleDelete}
          starred={starredMails}
          important={importantMails}
        />
      )}
    </div>
  );
}

export default ImportantScreen;
