import { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { CiBookmarkPlus } from "react-icons/ci";
import { MdReport } from "react-icons/md";
import { FiShare } from "react-icons/fi";
import { MdOutlineDelete, MdOutlineFlag, MdFlag } from "react-icons/md";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./ViewMail.css";
import LabelDropdown from "../Labels/LabelDropdown";
import { getSelectedLabelsOfMail } from "../Labels/apiLabels";

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
  setMessages,
  isSpamScreen = false,
  restore,
  onAssignLabel,
  removeMailFromLabel,
  labels,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState([]);
  // Check if the screen is spam to present restorefrom spam button
  const location = useLocation();
  const isLabelScreen = location.pathname.startsWith("/main/labels/");
  const showRestoreFromSpamBtn = location.pathname.startsWith("/main/spam");
  const isSentScreen = location.pathname.startsWith("/main/sent");
  const navigate = useNavigate();
  const { labelName } = useParams();

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

  useEffect(() => {
    async function fetchLabels() {
      try {
        const labels = await getSelectedLabelsOfMail(mail._id);
        const validLabels = labels.filter((l) => l && l._id);
        setSelectedLabel(validLabels.map((l) => l._id));
      } catch (err) {
        console.error("Failed to load mail labels:", err.message);
      }
    }

    if (mail) {
      fetchLabels();
    }
  }, [mail]);

  return (
    <div className="mail-details">
      <div className="mail-details-actions">
        <div className="mail-details-icons">
          <span
            onClick={() => {
              if (!disabledActions) onStarToggle(mail._id);
            }}
            className={`star-icon ${starred?.has(mail._id) ? "active" : ""} ${
              disabledActions || isSpamScreen ? "disabled" : ""
            }`}
            title="Mark with Star"
          >
            {starred?.has(mail._id) && !isSpamScreen ? "⭐" : "☆"}
          </span>
          <span
            onClick={() => {
              if (!disabledActions) onImportantToggle(mail._id);
            }}
            className={`flag-icon ${
              important?.has(mail._id) && !isSpamScreen ? "important" : ""
            } ${disabledActions || isSpamScreen ? "disabled" : ""}`}
            title="Mark as Important"
          >
            {important?.has(mail._id) && !isSpamScreen ? (
              <MdFlag />
            ) : (
              <MdOutlineFlag />
            )}
          </span>
          <span
            onClick={() => {
              if (!disabledActions) onDelete(mail._id, setMessages);
            }}
            className={`trash-icon ${disabledActions ? "disabled" : ""}`}
            title="Move to trash"
          >
            <MdOutlineDelete />
          </span>
          <span
            onClick={() => {
              if (!isSpamScreen) moveToSpam(mail._id, setMessages);
            }}
            className={`spam-icon ${isSpamScreen ? "disabled" : ""}`}
            title="Mark as Spam"
          >
            <MdReport />
          </span>
          {showRestoreFromSpamBtn && (
            <span
              className="restore-from-spam-button"
              onClick={() => restore(mail._id)}
              aria-label="restore to inbox"
              title="Restore from Spam"
            >
              <FiShare />
            </span>
          )}
          <div style={{ position: "relative" }}>
            <span
              className={`label-icon ${
                disabledActions || isSpamScreen ? "disabled" : ""
              }`}
              title="Assign label"
              onClick={async () => {
                if (!isSpamScreen || !disabledActions) {
                  const labels = await getSelectedLabelsOfMail(mail._id);
                  setSelectedLabel(labels.map((l) => l._id));
                  setShowDropdown((prev) => !prev);
                }
              }}
            >
              <CiBookmarkPlus size={22} />
            </span>

            {showDropdown && !isSpamScreen && (
              <LabelDropdown
                labels={labels}
                selected={selectedLabel}
                onSelect={(label, isChecked) => {
                  if (isChecked) {
                    onAssignLabel(mail._id, label._id, setMessages);
                    if (!selectedLabel.includes(label._id)) {
                      setSelectedLabel([...selectedLabel, label._id]);
                    }
                  } else {
                    removeMailFromLabel(mail._id, label._id, setMessages);
                    setSelectedLabel(
                      selectedLabel.filter((id) => id !== label._id.toString())
                    );
                    if (isLabelScreen) {
                      navigate("/main/labels/" + labelName);
                    }
                  }
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
