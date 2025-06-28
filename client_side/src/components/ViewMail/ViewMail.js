import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { CiBookmarkPlus } from "react-icons/ci";
import { MdReport } from "react-icons/md";
import { FiShare } from "react-icons/fi";
import { MdOutlineDelete, MdOutlineFlag, MdFlag } from "react-icons/md";
import { useLocation } from "react-router-dom";
import "./ViewMail.css";
import LabelDropdown from "../Labels/LabelDropdown";

function MailDetails({
  mail,
  onClose,
  onDelete,
  onStarToggle,
  onImportantToggle,
  starred,
  important,
  onAssignLabel,
  moveToSpam,
  disabledActions = false,
  setMessages,
  isSpamScreen = false,
  restore,
  labels = [],
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  // Check if the screen is spam to present restorefrom spam button
  const location = useLocation();
  const showRestoreFromSpamBtn = location.pathname.startsWith("/main/spam");
  const isSentScreen = location.pathname.startsWith("/main/sent");

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
              if (!disabledActions) onStarToggle(mail.id);
            }}
            className={`star-icon ${starred?.has(mail.id) ? "active" : ""} ${
              disabledActions || isSpamScreen ? "disabled" : ""
            }`}
            title="Mark with Star"
          >
            {starred?.has(mail.id) && !isSpamScreen ? "⭐" : "☆"}
          </span>
          <span
            onClick={() => {
              if (!disabledActions) onImportantToggle(mail.id);
            }}
            className={`flag-icon ${
              important?.has(mail.id) && !isSpamScreen ? "important" : ""
            } ${disabledActions || isSpamScreen ? "disabled" : ""}`}
            title="Mark as Important"
          >
            {important?.has(mail.id) && !isSpamScreen ? (
              <MdFlag />
            ) : (
              <MdOutlineFlag />
            )}
          </span>
          <span
            onClick={() => {
              if (!disabledActions) onDelete(mail.id, setMessages);
            }}
            className={`trash-icon ${disabledActions ? "disabled" : ""}`}
            title="Move to trash"
          >
            <MdOutlineDelete />
          </span>
          <span
            onClick={() => {
              if (!isSpamScreen) moveToSpam(mail.id, setMessages);
            }}
            className={`spam-icon ${isSpamScreen ? "disabled" : ""}`}
            title="Mark as Spam"
          >
            <MdReport />
          </span>
          {showRestoreFromSpamBtn && (
            <span
              className="restore-from-spam-button"
              onClick={() => restore(mail.id)}
              aria-label="restore to inbox"
              title="Restore from Spam"
            >
              <FiShare />
            </span>
          )}
          <div style={{ position: "relative" }}>
            <span
              className="label-icon"
              title="Assign label"
              onClick={(e) => {
                console.log("clicked!");
                e.stopPropagation();
                setShowDropdown((prev) => !prev);
              }}
            >
              <CiBookmarkPlus size={22} />
            </span>

            {showDropdown && (
              <LabelDropdown
                labels={labels}
                onSelect={(label) => {
                  onAssignLabel(mail.id, label.id);
                  setShowDropdown(false);
                }}
                onClose={() => setShowDropdown(false)}
              />
            )}
          </div>
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

      <div className="mail-details-label">
        {isSentScreen ? "To: " : "From: "}
      </div>
      <div className="mail-details-sender-box">
        {isSentScreen ? mail.receiver_address : mail.sender_address}
      </div>

      <div className="mail-details-label">Content:</div>
      <p className="mail-details-content-body">{mail.content}</p>
    </div>
  );
}

export default MailDetails;
