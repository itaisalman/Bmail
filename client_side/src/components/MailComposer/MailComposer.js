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
        const res = await fetch("/api/mails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        console.log(res.json);
        // // Parse response
        // const data = await res.json();

        // // Handle unsuccessful login
        // if (!res.ok) {
        //   const errorMessage = data?.error || "Login failed";
        //   const newErrors = {};

        //   // Map error message to appropriate field
        //   if (errorMessage.toLowerCase().includes("username")) {
        //     newErrors.username = errorMessage;
        //   } else if (errorMessage.toLowerCase().includes("password")) {
        //     newErrors.password = errorMessage;
        //   } else {
        //     newErrors.general = errorMessage;
        //   }

        //   setErrors(newErrors);
        //   return;
        // }

        // Clear previous errors
        // setErrors({});
        // window.location.href = "/main";
      } catch (err) {
        // Handle fetch/network errors
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
<<<<<<< HEAD
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
=======
        <button onClick={onClose}>✖</button>
      </div>
      <form className="composer-form">
        <input type="text" placeholder="To" />
        <input type="text" placeholder="Subject" />
        <textarea placeholder="Message..." />
>>>>>>> f9abf4f44f0ef651f8b1cf2ba178ab557d19908c
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default MailComposer;
