import { Outlet, useParams, useOutletContext } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import "../Inbox/Inbox.css";
import MailList from "../MailList/MailList";
import MailsControl from "../MailsControl/MailsControl";

function LabelView() {
  const params = useParams();
  const [messages, setMessages] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    starredMails,
    importantMails,
    toggleStar,
    toggleImportant,
    handleDelete,
    handleMoveToSpam,
    toggleLabel,
    labels,
    onAssignLabel,
    removeMailFromLabel,
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
            label: params.labelName,
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
    [currentPage, params.labelName]
  );

  useEffect(() => {
    fetchAssignLabel();
  }, [fetchAssignLabel]);
  // After removing a label – removes the email from the list
  const handleLabelToggle = async (id) => {
    await toggleLabel(id);
    setMessages((prev) => prev.filter((mail) => mail._id !== id));
  };
  return (
    <div className="inboxScreen">
      {params.id ? (
        <Outlet
          context={{
            starredMails,
            importantMails,
            toggleStar,
            toggleImportant,
            handleDelete,
            handleMoveToSpam,
            setMessages,
            handleLabelToggle,
            onAssignLabel,
            removeMailFromLabel,
            labels,
          }}
        />
      ) : (
        <>
          <MailsControl
            currentPage={currentPage}
            totalCount={totalCount}
            onRefresh={fetchAssignLabel}
            onPageChange={setCurrentPage}
          />

          {error && <p className="error-message">{error}</p>}

          <MailList
            mails={messages}
            starred={starredMails}
            important={importantMails}
            onStarToggle={toggleStar}
            onImportantToggle={toggleImportant}
            onDelete={handleDelete}
            setMessages={setMessages}
          />
        </>
      )}
    </div>
  );
}

export default LabelView;
