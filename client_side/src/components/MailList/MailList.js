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
}) {
  return (
    <>
      <div className="mail-list-header">
        <span className="header-sender">Sender</span>
        <span className="header-subject">Title</span>
        <span className="header-snippet">Content</span>
        <span className="header-date">Date</span>
        <span className="header-icons">Actions</span>
      </div>

      <ul className="mail-list">
        {mails.map((mail) => (
          <div
            key={mail.id}
            className="mail-preview"
            onClick={() => onSelect(mail.id)}
          >
            <div className="mail-sender">
              {mail.sender_address.split("@")[0]}
            </div>
            <div className="mail-subject">{mail.title}</div>
            <div className="mail-snippet">{mail.content}</div>
            <div className="mail-date">{mail.date}</div>

            <div className="mail-icons" onClick={(e) => e.stopPropagation()}>
              <span
                onClick={() => onStarToggle(mail.id)}
                aria-label="Star mail"
                className="star-icon"
              >
                {starred.has(mail.id) ? "⭐" : "☆"}
              </span>
              <span
                onClick={() => onImportantToggle(mail.id)}
                aria-label="Important mail"
                className={`flag-icon ${
                  important.has(mail.id) ? "important" : ""
                }`}
              >
                {important.has(mail.id) ? <MdFlag /> : <MdOutlineFlag />}
              </span>
              <span
                onClick={() => onDelete(mail.id)}
                aria-label="Delete mail"
                className="delete-icon"
              >
                <MdOutlineDelete />
              </span>
            </div>
          </div>
        ))}
      </ul>
    </>
  );
}

export default MailList;
