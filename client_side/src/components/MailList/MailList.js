import { MdOutlineFlag, MdFlag, MdOutlineDelete } from "react-icons/md";
import "./MailList.css";

function MailList({
  mails,
  starred,
  important,
  onSelect,
  onStarToggle,
  onImportantToggle,
  onDelete,
  disabledActions = false,
}) {
  // Format date string to "YYYY-MM-DD" (short format)
  function formatDateShort(dateString) {
    return dateString ? dateString.split("T")[0] : "";
  }

  return (
    <div className="mail-list-wrapper">
      <div className="mail-list-header">
        <span className="header-sender">Sender</span>
        <span className="header-subject">Title</span>
        <span className="header-snippet">Content</span>
        <span className="header-date">Date</span>
        <span className="header-icons">Actions</span>
      </div>

      <ul className="mail-list">
        {mails.map((mail) => (
          <li
            key={mail.id}
            className="mail-preview"
            onClick={() => onSelect(mail.id)}
          >
            <div className="mail-sender">
              {mail.sender_address
                ? mail.sender_address.split("@")[0]
                : "(unknown)"}
            </div>
            <div className="mail-subject">{mail.title || "(no title)"}</div>
            <div className="mail-snippet">{mail.content || "(empty)"}</div>
            <div className="mail-date">{formatDateShort(mail.date)}</div>

            <div className="mail-icons" onClick={(e) => e.stopPropagation()}>
              <span
                onClick={() => {
                  if (!disabledActions) onStarToggle(mail.id);
                }}
                aria-label="Star mail"
                className={`star-icon ${disabledActions ? "disabled" : ""}`}
              >
                {starred.has(mail.id) ? "⭐" : "☆"}
              </span>
              <span
                onClick={() => {
                  if (!disabledActions) onImportantToggle(mail.id);
                }}
                aria-label="Important mail"
                className={`flag-icon ${
                  important.has(mail.id) ? "important" : ""
                } ${disabledActions ? "disabled" : ""}`}
              >
                {important.has(mail.id) ? <MdFlag /> : <MdOutlineFlag />}
              </span>
              <span
                onClick={() => {
                  if (!disabledActions) onDelete(mail.id);
                }}
                aria-label="Delete mail"
                className={`delete-icon ${disabledActions ? "disabled" : ""}`}
              >
                <MdOutlineDelete />
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MailList;
