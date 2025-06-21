import { useState } from "react";
import { Outlet } from "react-router-dom";
import ButtonMailComposer from "../components/ButtonMailComposer/ButtonMailComposer";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar/Topbar";
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
        <Topbar />
        <Outlet />
      </main>
      {showComposer && <ButtonMailComposer onClose={toggleComposer} />}
    </div>
  );
}

export default MainScreen;
