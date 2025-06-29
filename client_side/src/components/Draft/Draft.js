import MailsControl from "../MailsControl/MailsControl";
import { useEffect, useState, useCallback } from "react";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import MailList from "../MailList/MailList";
import "./Draft.css";

function Draft() {
  const [drafts, setDrafts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const { setAction } = useOutletContext();
  const navigate = useNavigate();

  // Fetch inbox data from the server for the current page
  const fetchDraft = useCallback(
    async (page = currentPage) => {
      try {
        const token = sessionStorage.getItem("jwt");

        const res = await fetch(`/api/mails?page=${page}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: "bearer " + token,
            label: "Draft",
          },
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error);
          return;
        }
        setDrafts(data.mails);
        setTotalCount(data.totalCount);
        setAction(() => fetchDraft);
      } catch (err) {
        setError("Error loading draft: " + err.message);
      }
    },
    [currentPage, setAction]
  );
  // Fetch drafts whenever the page changes
  useEffect(() => {
    fetchDraft();
  }, [fetchDraft]);

  // Remove a draft from drafts array.
  const toggleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem("jwt");
      const delete_draft_res = await fetch(`/api/mails/draft/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: "bearer " + token,
        },
      });
      if (!delete_draft_res.ok) {
        setError("Communication error with the server");
        return;
      }
      // Success
      setError("");
      await fetchDraft();
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="inboxScreen">
      <MailsControl
        currentPage={currentPage}
        totalCount={totalCount}
        onRefresh={fetchDraft}
        onPageChange={setCurrentPage}
      />

      {error && <p className="error-message">{error}</p>}

      <div className="inbox-body">
        <MailList
          mails={drafts}
          onDelete={toggleDelete}
          onSelect={(mail) => {
            setSelectedDraft(mail);
            navigate(`/main/drafts/${mail.id}`);
          }}
          disabledActions={true}
        />
      </div>
      <Outlet
        context={{
          draft: selectedDraft,
          onClose: () => {
            navigate("/main/drafts");
            setTimeout(() => {
              setSelectedDraft(null);
            }, 100);
            fetchDraft();
          },
        }}
      />
    </div>
  );
}

export default Draft;
