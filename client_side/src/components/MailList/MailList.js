import { MdOutlineFlag, MdFlag, MdOutlineDelete } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import "./MailList.css";

function MailList({
  mails,
  starred,
  important,
  onStarToggle,
  onImportantToggle,
  onDelete,
  disabledActions = false,
  setMessages,
  isSpamScreen = false,
  onSelect = false,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  // We use this component for several usages.
  // When the user is on drafts/sent labels, we would like to show the appropriate data on screen.
  const showReceiver =
    location.pathname.startsWith("/main/drafts") ||
    location.pathname.startsWith("/main/sent");

  const showDelete = location.pathname.startsWith("/main/drafts");

  // Format date string to "YYYY-MM-DD" (short format)
  function formatDateShort(dateString) {
    return dateString ? dateString.split("T")[0] : "";
  }
  const handleSelect = (mail) => {
    if (onSelect) onSelect(mail);
    else
      navigate(`${location.pathname}/${mail.id}`, {
        state: { mail, from: location.pathname },
      });
  };

  return (
    <div className="mail-list-wrapper">
      <div className="mail-list-header">
        <span className="header-sender">
          {showReceiver ? "Receiver" : "Sender"}
        </span>
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
            onClick={() => handleSelect(mail)}
          >
            <div className="mail-sender">
              {showReceiver
                ? mail.receiver_address.split("@")[0]
                : mail.sender_address.split("@")[0]}
            </div>
            <div className="mail-subject">{mail.title || "(no title)"}</div>
            <div className="mail-snippet">{mail.content || "(empty)"}</div>
            <div className="mail-date">{formatDateShort(mail.date)}</div>
            <div className="mail-icons" onClick={(e) => e.stopPropagation()}>
              <span
                onClick={() => {
                  if (!disabledActions) onStarToggle(mail.id);
                }}
                title="Mark with Star"
                aria-label="Star mail"
                className={`star-icon ${
                  disabledActions || isSpamScreen ? "disabled" : ""
                }`}
              >
                {starred?.has(mail.id) && !isSpamScreen ? "⭐" : "☆"}
              </span>

              <span
                onClick={() => {
                  if (!disabledActions) onImportantToggle(mail.id);
                }}
                title="Mark as Important"
                aria-label="Important mail"
                className={`flag-icon ${
                  important?.has(mail.id) && !isSpamScreen ? "important" : ""
                } ${disabledActions || isSpamScreen ? "disabled" : ""}`}
              >
                {important?.has(mail.id) && !isSpamScreen ? (
                  <MdFlag />
                ) : (
                  <MdOutlineFlag />
                )}
              </span>
              <span
                onClick={() => {
                  if (!disabledActions || showDelete)
                    onDelete(mail.id, setMessages);
                }}
                title="Move to trash"
                aria-label="Delete mail"
                className={`delete-icon ${
                  !disabledActions || showDelete ? "" : "disabled"
                }`}
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
