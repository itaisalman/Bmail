import { useParams, useOutletContext } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import "../Inbox/Inbox.css";
import MailList from "../MailList/MailList";
import MailDetails from "../ViewMail/ViewMail";
import MailsControl from "../MailsControl/MailsControl";

function LabelView() {
  const { labelName } = useParams();
  const [messages, setMessages] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState("");
  const [selectedMail, setSelectedMail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    starredMails,
    importantMails,
    userLabelsMails,
    toggleStar,
    toggleImportant,
    deleteMail,
    toggleLabel,
    labels,
    onAssignLabel,
  } = useOutletContext();

  // Designed to load the list of emails associated with a specific label
  const fetchAssignLabel = useCallback(
    async (page = currentPage) => {
      try {
        const token = sessionStorage.getItem("jwt");

        const res = await fetch(`/api/mails?page=${page}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: "bearer " + token,
            label: labelName,
          },
        });

        if (!res.ok) throw new Error("Failed to load labeled mails");

        const data = await res.json();
        setMessages(data.mails);
        setTotalCount(data.totalCount);
        setError("");
      } catch (err) {
        setError(err.message);
      }
    },
    [currentPage, labelName]
  );

  useEffect(() => {
    fetchAssignLabel();
  }, [fetchAssignLabel]);

  // Opening a specific email
  const handleMailClick = async (id) => {
    const token = sessionStorage.getItem("jwt");
    const res = await fetch(`/api/mails/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setSelectedMail(data);
  };

  // After removing a label – removes the email from the list
  const handleLabelToggle = async (id) => {
    await toggleLabel(id);
    setMessages((prev) => prev.filter((mail) => mail.id !== id));
    if (selectedMail?.id === id) setSelectedMail(null);
  };

  const handleDelete = async (id) => {
    await deleteMail(id);
    setMessages((prev) => prev.filter((mail) => mail.id !== id));
    if (selectedMail?.id === id) setSelectedMail(null);
  };

  return (
    <div className="inboxScreen">
      {!selectedMail && (
        <MailsControl
          currentPage={currentPage}
          totalCount={totalCount}
          onRefresh={fetchAssignLabel}
          onPageChange={setCurrentPage}
        />
      )}

      {error && <p className="error-message">{error}</p>}

      {!selectedMail ? (
        <div className="inbox-body">
          <MailList
            mails={messages}
            starred={starredMails}
            important={importantMails}
            onSelect={handleMailClick}
            onStarToggle={toggleStar}
            onImportantToggle={toggleImportant}
            onLabelToggle={handleLabelToggle}
            onDelete={handleDelete}
            onAssignLabel={onAssignLabel}
          />
        </div>
      ) : (
        <MailDetails
          mail={selectedMail}
          onClose={() => setSelectedMail(null)}
          onStarToggle={toggleStar}
          onImportantToggle={toggleImportant}
          onLabelToggle={handleLabelToggle}
          labels={labels}
          onDelete={handleDelete}
          starred={starredMails}
          important={importantMails}
          userLabels={userLabelsMails}
          onAssignLabel={onAssignLabel}
        />
      )}
    </div>
  );
}

export default LabelView;
