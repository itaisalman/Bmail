import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar/Topbar";
import "./MainScreen.css";

function MainScreen() {
  return (
    <div className="main-container">
      <Sidebar />
      <main className="main-content">
        <Topbar />
        <Outlet />
      </main>
    </div>
  );
}

export default MainScreen;
