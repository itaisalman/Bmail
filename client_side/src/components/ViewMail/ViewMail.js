import { RxCross2 } from "react-icons/rx";
import { MdReport } from "react-icons/md";
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
  moveToSpam,
  disabledActions = false,
  isSpamScreen,
}) {
  // Don't render anything if no mail is selected
  if (!mail) return null;

  // Format a date string to "YYYY-MM-DD HH:mm"
  function formatDateTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  return (
    <div className="mail-details">
      <div className="mail-details-actions">
        <div className="mail-details-icons">
          <span
            onClick={() => {
              if (!disabledActions && !isSpamScreen) onStarToggle(mail.id);
            }}
            className={`star-icon ${starred.has(mail.id) ? "active" : ""} ${
              disabledActions || isSpamScreen ? "disabled" : ""
            }`}
            title="Star"
          >
            {starred.has(mail.id) ? "⭐" : "☆"}
          </span>
          <span
            onClick={() => {
              if (!disabledActions && !isSpamScreen) onImportantToggle(mail.id);
            }}
            className={`flag-icon ${
              important.has(mail.id) ? "important" : ""
            } ${disabledActions || isSpamScreen ? "disabled" : ""}`}
            title="Important"
          >
            {important.has(mail.id) ? <MdFlag /> : <MdOutlineFlag />}
          </span>
          <span
            onClick={() => {
              if (!disabledActions) onDelete(mail.id);
            }}
            className={`trash-icon ${disabledActions ? "disabled" : ""}`}
            title="Delete"
          >
            <MdOutlineDelete />
          </span>
          <span
            onClick={() => {
              if (!isSpamScreen) moveToSpam(mail.id);
            }}
            className={`spam-icon ${isSpamScreen ? "disabled" : ""}`}
            title="Mark as Spam"
          >
            <MdReport />
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

      <div className="mail-details-header">
        <div className="mail-details-date">{formatDateTime(mail.date)}</div>
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
