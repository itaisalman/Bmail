import { useEffect, useState, useCallback } from "react";
import { Outlet, useParams, useOutletContext } from "react-router-dom";
import "../Inbox/Inbox.css";
import MailList from "../MailList/MailList";
import MailsControl from "../MailsControl/MailsControl";

function SentScreen() {
  // State variables for sent data and UI state
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
  } = useOutletContext();

  // Fetch sent mails from the server for the current page
  const fetchSent = useCallback(
    async (page = currentPage) => {
      try {
        const token = sessionStorage.getItem("jwt");

        const res = await fetch(`/api/mails?page=${page}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: "bearer " + token,
            label: "Sent",
          },
        });

        if (!res.ok) throw new Error("Failed to load sent mails");
        setError("");
        const data = await res.json();
        setMessages(data.mails);
        setTotalCount(data.totalCount);
        setAction(() => fetchSent);
      } catch (err) {
        setError(err.message);
      }
    },
    [currentPage, setAction]
  );

  // Fetch sent mails whenever the page changes
  useEffect(() => {
    fetchSent(currentPage);
  }, [fetchSent, currentPage]);

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
          }}
        />
      ) : (
        <>
          <MailsControl
            currentPage={currentPage}
            totalCount={totalCount}
            onRefresh={fetchSent}
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

export default SentScreen;
