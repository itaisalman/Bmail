import { RxCross2 } from "react-icons/rx";
import { MdOutlineDelete, MdOutlineFlag, MdFlag } from "react-icons/md";
import "./ViewMail.css";

function MailDetails({
  mail,
  onClose,
  onDelete,
  onStarToggle,
  onImportantToggle,
  starred,
  important,
}) {
  if (!mail) return null;

  return (
    <div className="mail-details">
      {/* שורת הפעולות העליונה */}
      <div className="mail-details-actions">
        <div className="mail-details-icons">
          <span
            onClick={() => onStarToggle(mail.id)}
            className="star-icon"
            title="Star"
          >
            {starred.has(mail.id) ? "⭐" : "☆"}
          </span>
          <span
            onClick={() => onImportantToggle(mail.id)}
            className={`flag-icon ${important.has(mail.id) ? "important" : ""}`}
            title="Important"
          >
            {important.has(mail.id) ? <MdFlag /> : <MdOutlineFlag />}
          </span>
          <span
            onClick={() => onDelete(mail.id)}
            className="trash-icon"
            title="Delete"
          >
            <MdOutlineDelete />
          </span>
        </div>

        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close mail view"
        >
          <RxCross2 size={24} />
        </button>
      </div>

      {/* פרטי המייל */}
      <div className="mail-details-header">
        <div className="mail-details-date">{mail.date}</div>
        <h3 className="mail-details-subject">{mail.title}</h3>
      </div>

      <div className="mail-details-label">From:</div>
      <div className="mail-details-sender-box">{mail.sender_address}</div>

      <div className="mail-details-label">Content:</div>
      <p className="mail-details-content-body">{mail.content}</p>
    </div>
  );
}

export default MailDetails;
