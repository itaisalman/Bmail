import { useEffect, useState } from "react";
import "../Inbox/Inbox.css";
import { FiRefreshCw } from "react-icons/fi";
import { MdOutlineFlag, MdFlag } from "react-icons/md"; // אייקונים של דגל

function InboxScreen() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [starredMails, setStarredMails] = useState(new Set());
  const [importantMails, setImportantMails] = useState(new Set());

  const fetchInbox = async () => {
    try {
      const token = sessionStorage.getItem("jwt");
      if (!token) return;

      const res = await fetch("/api/mails", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "bearer " + token,
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

  return (
    <div className="inboxScreen">
      <div className="inbox-header">
        <h2>Inbox</h2>
        <button className="refresh-button" onClick={fetchInbox}>
          <FiRefreshCw size={20} />
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}

      <div className="mail-list-header">
        <span className="header-sender">Sender</span>
        <span className="header-subject">Subject</span>
        <span className="header-snippet">Snippet</span>
        <span className="header-date">Date</span>
        <span className="header-icons">Actions</span>
      </div>
      <ul className="mail-list">
        {messages.map((mail) => (
          <div key={mail.id} className="mail-preview">
            <div className="mail-sender">{mail.sender.split("@")[0]}</div>
            <div className="mail-subject">{mail.subject}</div>
            <div className="mail-snippet">{mail.snippet}</div>
            <div className="mail-date">{mail.date}</div>

            <div className="mail-icons">
              <span
                onClick={() => toggleStar(mail.id)}
                aria-label="Star mail"
                className="star-icon"
              >
                {starredMails.has(mail.id) ? "⭐" : "☆"}
              </span>
              <span
                onClick={() => toggleImportant(mail.id)}
                aria-label="Important mail"
                className={`flag-icon ${
                  importantMails.has(mail.id) ? "important" : ""
                }`}
              >
                {importantMails.has(mail.id) ? <MdFlag /> : <MdOutlineFlag />}
              </span>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default InboxScreen;
