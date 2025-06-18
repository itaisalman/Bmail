import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import MailComposer from "../components/MailComposer/MailComposer";
import "./MainScreen.css";

function MainScreen() {
  const [showComposer, setShowComposer] = useState(false);

  const toggleComposer = () => {
    setShowComposer((prev) => !prev);
  };

  return (
    <div className="main-container">
      <Sidebar onNewMailClick={toggleComposer} />
      <main className="main-content">
        <Outlet />
      </main>
      {showComposer && <MailComposer onClose={toggleComposer} />}
    </div>
  );
}

export default MainScreen;
