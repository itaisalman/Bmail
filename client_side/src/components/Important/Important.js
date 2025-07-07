import { useEffect, useState, useCallback } from "react";
import { Outlet, useParams, useOutletContext } from "react-router-dom";
import "../Inbox/Inbox.css";
import MailList from "../MailList/MailList";
import MailsControl from "../MailsControl/MailsControl";

function ImportantScreen() {
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
    labels,
    onAssignLabel,
    removeMailFromLabel,
  } = useOutletContext();

  const fetchImportant = useCallback(
    async (page = currentPage) => {
      try {
        const token = sessionStorage.getItem("jwt");

        const res = await fetch(`/api/mails?page=${page}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: "bearer " + token,
            label: "Important",
          },
        });

        if (!res.ok) throw new Error("Failed to load important mails");

        const data = await res.json();
        setMessages(data.mails);
        setTotalCount(data.totalCount);
        setError("");
      } catch (err) {
        setError(err.message);
      }
    },
    [currentPage]
  );

  // Fetch important whenever the page changes
  useEffect(() => {
    fetchImportant();
  }, [fetchImportant]);

  const handleImportantToggle = async (id) => {
    await toggleImportant(id);
    // Remove mail localy
    setMessages((prev) => prev.filter((mail) => mail._id !== id));
  };

  return (
    <div className="inboxScreen">
      {id ? (
        <Outlet
          context={{
            starredMails,
            importantMails,
            toggleStar,
            toggleImportant: handleImportantToggle,
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
            onRefresh={fetchImportant}
            onPageChange={setCurrentPage}
          />

          {error && <p className="error-message">{error}</p>}

          <div className="inbox-body">
            <MailList
              mails={messages}
              starred={starredMails}
              important={importantMails}
              onStarToggle={toggleStar}
              onImportantToggle={handleImportantToggle}
              onDelete={handleDelete}
              setMessages={setMessages}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default ImportantScreen;
