import "./MailComposer.css";
import { useState } from "react";

function MailComposer({ onClose }) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSend = async (send_type, e) => {
    e.preventDefault();
    // Clearing previous errors
    setError("");

    if (to || subject || message) {
      const payload = {
        receiver: to,
        title: subject,
        content: message,
        draft: send_type,
      };
      try {
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
        if (data.error === "Invalid/Missing Receiver") {
          setError("Invalid/Missing Receiver! Please try another receiver.");
          return;
        }
        console.log(data);
      } catch (err) {
        setError("An unexpected error occurred.");
        return;
      }
    }
    onClose();
  };

  return (
    <div className="composer-container">
      <div className="composer-header">
        <span>New Message</span>
        <button onClick={(e) => handleSend("true", e)}>✖</button>
      </div>
      {error && (
        <div
          className="error-message"
          style={{ color: "red", marginBottom: "10px" }}
        >
          {error}
        </div>
      )}
      <form className="composer-form" onSubmit={(e) => handleSend("false", e)}>
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
