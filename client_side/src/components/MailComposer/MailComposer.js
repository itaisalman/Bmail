import "./MailComposer.css";
import { useState } from "react";

function MailComposer({ onClose }) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // const handleSend = async (send_type, e) => {
  //   e.preventDefault();

  //   if (to || subject || message) {
  //     const payload = {
  //       receiver: to,
  //       title: subject,
  //       content: message,
  //       draft: send_type,
  //     };
  //     try {
  //       const token = sessionStorage.getItem("jwt");
  //       if (!token) return;
  //       const res = await fetch("/api/mails", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           authorization: "bearer " + token,
  //         },
  //         body: JSON.stringify(payload),
  //       });

  //       const data = await res.json();
  //       onClose();
  //     } catch (err) {
  //       return;
  //     }
  //   }
  //   onClose();
  // };
  const handleSend = async (send_type, e) => {
    e.preventDefault();

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
        if (!res.ok || data.error === "Invalid/Missing Receiver")
          alert(data.error || "Failed to send message.");

        onClose();
      } catch (err) {
        alert("Failed to connect to the server. Please try again later.");
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="composer-container">
      <div className="composer-header">
        <span>New Message</span>
        <button onClick={(e) => handleSend("true", e)}>✖</button>
      </div>
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
