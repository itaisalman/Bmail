import { useEffect, useState, useCallback } from "react";
import { Outlet, useParams, useOutletContext } from "react-router-dom";
import "../Inbox/Inbox.css";
import MailList from "../MailList/MailList";
import MailsControl from "../MailsControl/MailsControl";

function SpamScreen() {
  // State variables for spam data and UI state
  const [messages, setMessages] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams();
  const isSpamScreen = true;

  const { starredMails, importantMails, handleDelete } = useOutletContext();

  // Fetch spam data from the server for the current page
  const fetchSpam = useCallback(
    async (page = currentPage) => {
      try {
        const token = sessionStorage.getItem("jwt");

        const res = await fetch(`/api/mails?page=${page}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: "bearer " + token,
            label: "Spam",
          },
        });

        if (!res.ok) throw new Error("Failed to load spam");
        setError("");
        const data = await res.json();
        setMessages(data.mails);
        setTotalCount(data.totalCount);
      } catch (err) {
        setError(err.message);
      }
    },
    [currentPage]
  );

  // Fetch spam whenever the page changes
  useEffect(() => {
    fetchSpam(currentPage);
  }, [fetchSpam, currentPage]);

  // When user clicks empty trash button
  const RestoreFromSpam = async (id) => {
    setError("");

    try {
      const token = sessionStorage.getItem("jwt");
      const res = await fetch(`/api/mails/spam/${id}`, {
        method: "DELETE",
        headers: {
          authorization: "bearer " + token,
        },
      });

      if (!res.ok) throw new Error("Failed to remove from spam");

      // Updated values after delete all mails from user's trash
      setMessages((prev) => prev.filter((mail) => mail._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="inboxScreen">
      {id ? (
        <Outlet
          context={{
            handleDelete,
            isSpamScreen,
            setMessages,
            RestoreFromSpam,
          }}
        />
      ) : (
        <>
          <MailsControl
            currentPage={currentPage}
            totalCount={totalCount}
            onRefresh={fetchSpam}
            onPageChange={setCurrentPage}
          />

          {error && <p className="error-message">{error}</p>}

          <div className="inbox-body">
            <MailList
              mails={messages}
              starred={starredMails}
              important={importantMails}
              onDelete={handleDelete}
              isSpamScreen={true}
              setMessages={setMessages}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default SpamScreen;
