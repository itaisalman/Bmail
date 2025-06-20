import "./MailComposer.css";
import { useState } from "react";

function MailComposer({ onClose }) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState("");

  const handleDraft = async (e) => {
    e.preventDefault();
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setErrors("");
    if (to) {
      const payload = {
        receiver: to,
        title: subject,
        content: message,
      };

      try {
        const token = sessionStorage.getItem("jwt");
        const res = await fetch("/api/mails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "bearer " + token,
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401)
            setErrors("Token required. Please log in again.");
          else if (
            res.status === 400 &&
            data.error === "Invalid/Missing Receiver"
          )
            setErrors("Invalid/Missing receiver!");
          else setErrors("Server error: " + res.status);

          return;
        }

        // Success
        setErrors("");
        onClose();
      } catch (err) {
        setErrors("Failed to connect to the server. Please try again later.");
      }
    } else {
      setErrors("Receiver is required!");
      return;
    }
  };

  return (
    <div className="composer-container">
      <div className="composer-header">
        <span>New Message</span>
        <button onClick={(e) => handleDraft(e)}>✖</button>
      </div>
      <form className="composer-form" onSubmit={(e) => handleSend(e)}>
        {errors && <div className="composer-error-message">{errors}</div>}
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
