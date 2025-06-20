import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar/Topbar";
import MailComposer from "../components/MailComposer/MailComposer";
import Labels from "../components/Labels/Labels";
import "./MainScreen.css";

function MainScreen() {
  const [showComposer, setShowComposer] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [labels, setLabels] = useState([]);

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

  return (
    <div className="main-container">
      <Sidebar
        onNewMailClick={toggleComposer}
        onNewLabelClick={toggleLabels}
        labels={labels}
      />
      <main className="main-content">
        <Topbar />
        <Outlet />
      </main>
      {showComposer && <MailComposer onClose={toggleComposer} />}
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
