import { useEffect, useState, useCallback } from "react";
import { Outlet, useParams, useOutletContext } from "react-router-dom";
import MailList from "../MailList/MailList";
import MailsControl from "../MailsControl/MailsControl";
import "../Inbox/Inbox.css";

function InboxScreen() {
  // State variables for inbox data and UI state
  const [messages, setMessages] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams();
  const { setAction } = useOutletContext();

  const {
    starredMails,
    importantMails,
    toggleStar,
    toggleImportant,
    handleDelete,
    handleMoveToSpam,
    labels,
    onAssignLabel,
    removeMailFromLabel,
  } = useOutletContext();

  // Fetch inbox data from the server for the current page
  const fetchInbox = useCallback(
    async (page = currentPage) => {
      try {
        const token = sessionStorage.getItem("jwt");

        const res = await fetch(`/api/mails?page=${page}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: "bearer " + token,
            label: "Inbox",
          },
        });

        if (!res.ok) throw new Error("Failed to load inbox");
        setError("");
        const data = await res.json();
        setMessages(data.mails);
        setTotalCount(data.totalCount);
        setAction(() => fetchInbox);
      } catch (err) {
        setError("Error loading inbox: " + err.message);
      }
    },
    [currentPage, setAction]
  );

  // Fetch inbox whenever the page changes
  useEffect(() => {
    fetchInbox(currentPage);
  }, [fetchInbox, currentPage]);

  return (
    <div className="inboxScreen">
      {id ? (
        <Outlet
          context={{
            starredMails,
            importantMails,
            toggleStar,
            toggleImportant,
            handleDelete,
            handleMoveToSpam,
            setMessages,
            labels,
            onAssignLabel,
            removeMailFromLabel,
          }}
        />
      ) : (
        <>
          <MailsControl
            currentPage={currentPage}
            totalCount={totalCount}
            onRefresh={fetchInbox}
            onPageChange={setCurrentPage}
          />

          {error && <p className="error-message">{error}</p>}

          <div className="inbox-body">
            <MailList
              mails={messages}
              starred={starredMails}
              important={importantMails}
              onStarToggle={toggleStar}
              onImportantToggle={toggleImportant}
              onDelete={handleDelete}
              setMessages={setMessages}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default InboxScreen;
