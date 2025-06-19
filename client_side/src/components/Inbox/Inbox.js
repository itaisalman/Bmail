import { useEffect, useState } from "react";
import "../Inbox/Inbox.css";
import { FiRefreshCw } from "react-icons/fi";
import MailList from "../MailList/MailList";
import MailDetails from "../ViewMail/ViewMail";

function InboxScreen() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [starredMails, setStarredMails] = useState(new Set());
  const [importantMails, setImportantMails] = useState(new Set());
  const [selectedMail, setSelectedMail] = useState(null);

  const fetchInbox = async () => {
    try {
      const token = sessionStorage.getItem("jwt");
      if (!token) return;

      const res = await fetch("/api/mails", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "bearer " + token,
          label: "Inbox",
        },
      });

      if (!res.ok) throw new Error("Failed to load inbox");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      setError("Error loading inbox: " + err.message);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

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

  // const handleMailClick = (id) => {
  //   const mail = messages.find((m) => m.id === id);
  //   if (mail) setSelectedMail(mail);
  // };

  const toggleStar = (id) => {
    setStarredMails((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const toggleImportant = (id) => {
    setImportantMails((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const toggleDelete = (id) => {
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
  };

  return (
    <div className="inboxScreen">
      <div className="inbox-header">
        <button className="refresh-button" onClick={fetchInbox}>
          <FiRefreshCw size={20} />
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}

      {selectedMail ? (
        <MailDetails
          mail={selectedMail}
          onClose={() => setSelectedMail(null)}
          onStarToggle={toggleStar}
          onImportantToggle={toggleImportant}
          onDelete={toggleDelete}
          starred={starredMails}
          important={importantMails}
        />
      ) : (
        <MailList
          mails={messages}
          starred={starredMails}
          important={importantMails}
          onSelect={handleMailClick}
          onStarToggle={toggleStar}
          onImportantToggle={toggleImportant}
          onDelete={toggleDelete}
        />
      )}
    </div>
  );
}

export default InboxScreen;
