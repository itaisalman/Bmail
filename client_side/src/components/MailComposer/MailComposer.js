import "./MailComposer.css";
import { useState } from "react";

function MailComposer({ onClose }) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleClose = async (e) => {
    e.preventDefault();
    if (to || subject || message) {
      const payload = {
        receiver: to,
        title: subject,
        content: message,
        draft: "true",
      };
      try {
        // Send login request
        const token = sessionStorage.getItem("jwt");
        if (!token) return;
        const res = await fetch("/api/mails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "bearer " + token,
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        console.log(data);
      } catch (err) {
        console.log(err.message);
      }
    }
    onClose();
  };

  const handleSend = (e) => {
    e.preventDefault();
  };

  return (
    <div className="composer-container">
      <div className="composer-header">
        <span>New Message</span>
        <button onClick={handleClose}>✖</button>
      </div>
      <form className="composer-form" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          type="text"
          placeholder="Message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default MailComposer;
