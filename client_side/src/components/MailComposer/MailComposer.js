import "./MailComposer.css";

function MailComposer({ onClose }) {
  return (
    <div className="composer-container">
      <div className="composer-header">
        <span>New Message</span>
        <button onClick={onClose}>✖</button>
      </div>
      <form className="composer-form">
        <input type="text" placeholder="To" />
        <input type="text" placeholder="Subject" />
        <textarea placeholder="Message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default MailComposer;
