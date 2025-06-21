import { useState } from "react";
import "./MailComposer.css";

function MailComposer({ onSend, onClose, errors }) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleDraft = async (e) => {
    e.preventDefault();
    onClose({ to, subject, message });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    onSend({ to, subject, message });
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
