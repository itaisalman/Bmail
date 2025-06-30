import { useState, useEffect } from "react";
import "./MailComposer.css";

function MailComposer({ onSend, onClose, errors, receiver, title, content }) {
  const [to, setTo] = useState(receiver);
  const [subject, setSubject] = useState(title);
  const [message, setMessage] = useState(content);

  useEffect(() => {
    setTo(receiver);
    setSubject(title);
    setMessage(content);
  }, [receiver, title, content]);

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
