import { useEffect, useState, useCallback } from "react";
import { Outlet, useParams, useOutletContext } from "react-router-dom";
import MailList from "../MailList/MailList";
import MailDetails from "../ViewMail/ViewMail";
import MailsControl from "../MailsControl/MailsControl";
import "../Inbox/Inbox.css";

function InboxScreen() {
  // State variables for inbox data and UI state
  const [messages, setMessages] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams();

  const {
    starredMails,
    importantMails,
    toggleStar,
    toggleImportant,
    handleDelete,
    handleMoveToSpam,
    handleMailClick,
    setSelectedMail,
    selectedMail,
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
      } catch (err) {
        setError("Error loading inbox: " + err.message);
      }
    },
    [currentPage]
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
            setSelectedMail,
            setMessages,
          }}
        />
      ) : (
        <>
          {!selectedMail && (
            <MailsControl
              currentPage={currentPage}
              totalCount={totalCount}
              onRefresh={fetchInbox}
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
                onDelete={handleDelete}
                setMessages={setMessages}
              />
            </div>
          ) : (
            <MailDetails
              mail={selectedMail}
              onClose={() => setSelectedMail(null)}
              onStarToggle={toggleStar}
              onImportantToggle={toggleImportant}
              onDelete={handleDelete}
              moveToSpam={handleMoveToSpam}
              starred={starredMails}
              important={importantMails}
              setMessages={setMessages}
            />
          )}
        </>
      )}
    </div>
  );
}

export default InboxScreen;
