import { NavLink } from "react-router-dom";
import logo from "../../logo.jpg";
import {
  MdInbox,
  MdSend,
  MdReport,
  MdDrafts,
  MdLabel,
  MdStar,
  MdPriorityHigh,
  MdCreate,
} from "react-icons/md";
import "./Sidebar.css";

const links = [
  { name: "Inbox", path: "/main/inbox", icon: <MdInbox /> },
  { name: "Starred", path: "/main/starred", icon: <MdStar /> },
  { name: "Important", path: "/main/important", icon: <MdPriorityHigh /> },
  { name: "Sent", path: "/main/sent", icon: <MdSend /> },
  { name: "Drafts", path: "/main/drafts", icon: <MdDrafts /> },
  { name: "Spam", path: "/main/spam", icon: <MdReport /> },
  { name: "Labels", path: "/main/labels", icon: <MdLabel /> },
];

function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="top-container">
        <div className="logo-container">
          <img src={logo} alt="Bmail logo" className="logo" />
        </div>
        <button className="new-mail-button">
          <MdCreate size={20} />
          <span className="new-mail-text">New Mail</span>
        </button>
      </div>
      {links.map(({ name, path, icon }) => (
        <NavLink
          key={name}
          to={path}
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <div className="link-content">
            <span className="icon">{icon}</span>
            <span className="link-text">{name}</span>
          </div>
        </NavLink>
      ))}
    </nav>
  );
}

export default Sidebar;
