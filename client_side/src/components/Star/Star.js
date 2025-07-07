import { useEffect, useState, useCallback } from "react";
import { Outlet, useParams, useOutletContext } from "react-router-dom";
import "../Inbox/Inbox.css";
import MailList from "../MailList/MailList";
import MailsControl from "../MailsControl/MailsControl";

function StarredScreen() {
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

  // Fetch starred mails from the server for the current page
  const fetchStarred = useCallback(
    async (page = currentPage) => {
      try {
        const token = sessionStorage.getItem("jwt");

        const res = await fetch(`/api/mails?page=${page}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: "bearer " + token,
            label: "Starred",
          },
        });

        if (!res.ok) throw new Error("Failed to load starred");
        setError("");
        const data = await res.json();
        setMessages(data.mails);
        setTotalCount(data.totalCount);
      } catch (err) {
        setError("Failed to load starred");
      }
    },
    [currentPage]
  );

  // Fetch starred whenever the page changes
  useEffect(() => {
    fetchStarred(currentPage);
  }, [fetchStarred, currentPage]);

  const handleStarToggle = async (id) => {
    await toggleStar(id);
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
            toggleStar: handleStarToggle,
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
            onRefresh={fetchStarred}
            onPageChange={setCurrentPage}
          />

          {error && <p className="error-message">{error}</p>}

          <div className="inbox-body">
            <MailList
              mails={messages}
              starred={starredMails}
              important={importantMails}
              onStarToggle={handleStarToggle}
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

export default StarredScreen;
