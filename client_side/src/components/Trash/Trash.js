import { useEffect, useState, useCallback } from "react";
import { Outlet, useParams, useOutletContext } from "react-router-dom";
import "../Inbox/Inbox.css";
import MailList from "../MailList/MailList";
import MailsControl from "../MailsControl/MailsControl";

function TrashScreen() {
  const [messages, setMessages] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams();
  const disabledActions = true;

  const { handleMoveToSpam } = useOutletContext();

  // Fetch inbox data from the server for the current page
  const fetchTrash = useCallback(
    async (page = currentPage) => {
      try {
        const token = sessionStorage.getItem("jwt");

        const res = await fetch(`/api/mails?page=${page}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: "bearer " + token,
            label: "Trash",
          },
        });

        if (!res.ok) throw new Error("Failed to load trash");
        const data = await res.json();
        setMessages(data.mails);
        setTotalCount(data.totalCount);
        setError("");
      } catch (err) {
        setError("Failed to load trash");
      }
    },
    [currentPage]
  );

  // Fetch trash whenever the page changes
  useEffect(() => {
    fetchTrash(currentPage);
  }, [fetchTrash, currentPage]);

  // When user clicks empty trash button
  const handleEmptyTrash = async () => {
    setError("");

    try {
      const token = sessionStorage.getItem("jwt");

      const res = await fetch("/api/mails/trash", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: "bearer " + token,
        },
      });

      if (!res.ok) throw new Error("Failed to empty trash");

      // Updated values after delete all mails from user's trash
      setMessages([]);
      setTotalCount(0);
      setCurrentPage(1);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="inboxScreen">
      {id ? (
        <Outlet
          context={{
            handleMoveToSpam,
            disabledActions,
            setMessages,
          }}
        />
      ) : (
        <>
          <MailsControl
            currentPage={currentPage}
            totalCount={totalCount}
            onRefresh={fetchTrash}
            onPageChange={setCurrentPage}
            onEmptyTrash={handleEmptyTrash}
          />

          {error && <p className="error-message">{error}</p>}

          <div className="inbox-body">
            <MailList
              mails={messages}
              disabledActions={true}
              setMessages={setMessages}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default TrashScreen;
