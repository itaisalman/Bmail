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
import LabelItem from "../Labels/LabelItem.js";

const links = [
  { name: "Inbox", path: "/main/inbox", icon: <MdInbox /> },
  { name: "Starred", path: "/main/starred", icon: <MdStar /> },
  { name: "Important", path: "/main/important", icon: <MdPriorityHigh /> },
  { name: "Sent", path: "/main/sent", icon: <MdSend /> },
  { name: "Drafts", path: "/main/drafts", icon: <MdDrafts /> },
  { name: "Spam", path: "/main/spam", icon: <MdReport /> },
];

function Sidebar({
  onNewMailClick,
  onNewLabelClick,
  labels,
  onEditLabel,
  onStartEditLabel,
  onDeleteLabel,
}) {
  return (
    <nav className="sidebar">
      <div className="top-container">
        <div className="logo-container">
          <img src={logo} alt="Bmail logo" className="logo" />
        </div>
        <button className="new-mail-button" onClick={onNewMailClick}>
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
          <div className="link-main">
            <div className="link-content">
              <span className="icon">{icon}</span>
              <span className="link-text">{name}</span>
            </div>
          </div>
        </NavLink>
      ))}

      {/* Labels section */}
      <div className="sidebar-link labels-header">
        <div className="link-main">
          <div className="link-content">
            <span className="icon">
              <MdLabel />
            </span>
            <span className="link-text">Labels</span>
          </div>
          <button
            className="new-label-button"
            onClick={(e) => {
              e.preventDefault();
              onNewLabelClick();
            }}
          >
            ➕
          </button>
        </div>
      </div>

      {/* Custom user-defined labels */}
      <div className="labels-list-container">
        {labels.map((label) => (
          <LabelItem
            key={label.id}
            label={label}
            onEditLabel={onEditLabel}
            onStartEdit={onStartEditLabel}
            onDeleteLabel={(label) => onDeleteLabel(label)}
          />
        ))}
      </div>
    </nav>
  );
}

export default Sidebar;
