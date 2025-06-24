import { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";
import ButtonMailComposer from "../components/ButtonMailComposer/ButtonMailComposer";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar/Topbar";
import Labels from "../components/Labels/Labels";
import "./MainScreen.css";

function MainScreen() {
  const [showComposer, setShowComposer] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [labels, setLabels] = useState([]);
  const [starredMails, setStarredMails] = useState(new Set());
  const [importantMails, setImportantMails] = useState(new Set());

  const toggleStar = useCallback(async (id) => {
    const token = sessionStorage.getItem("jwt");
    if (!token) return;

    const res = await fetch(`/api/mails/star/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: "bearer " + token,
      },
    });
    if (!res.ok) return;

    setStarredMails((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  }, []);

  const toggleImportant = useCallback(async (id) => {
    const token = sessionStorage.getItem("jwt");
    if (!token) return;

    const res = await fetch(`/api/mails/important/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: "bearer " + token,
      },
    });
    if (!res.ok) return;

    setImportantMails((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  }, []);

  const toggleComposer = () => {
    setShowComposer((prev) => !prev);
  };

  const toggleLabels = () => setShowLabels((prev) => !prev);

  useEffect(() => {
    const token = sessionStorage.getItem("jwt");
    fetch("/api/labels", {
      headers: {
        authorization: "Bearer " + token,
        user: sessionStorage.getItem("userId"),
      },
    })
      .then((res) => res.json())
      .then((data) => setLabels(data));
  }, []);

  const deleteMail = async (id) => {
    const token = sessionStorage.getItem("jwt");
    if (!token) return;

    const res = await fetch(`/api/mails/${id}`, {
      method: "DELETE",
      headers: {
        authorization: "bearer " + token,
      },
    });

    if (!res.ok) return;

    setStarredMails((prev) => {
      const updated = new Set(prev);
      updated.delete(id);
      return updated;
    });

    setImportantMails((prev) => {
      const updated = new Set(prev);
      updated.delete(id);
      return updated;
    });
  };

  return (
    <div className="main-container">
      <Sidebar
        onNewMailClick={toggleComposer}
        onNewLabelClick={toggleLabels}
        labels={labels}
      />
      <main className="main-content">
        <Topbar />
        <Outlet
          context={{
            starredMails,
            importantMails,
            toggleStar,
            toggleImportant,
            deleteMail,
          }}
        />
      </main>
      {showComposer && <ButtonMailComposer onClose={toggleComposer} />}
      {showLabels && (
        <Labels
          onClose={toggleLabels}
          onNewLabelCreated={(newLabel) =>
            setLabels((prevLabels) => [...prevLabels, newLabel])
          }
        />
      )}
    </div>
  );
}

export default MainScreen;
