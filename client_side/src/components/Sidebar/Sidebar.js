import { NavLink } from "react-router-dom";
import logo from "../../logo.jpg";
import "./Sidebar.css";

const links = [
  { name: "Inbox", path: "/main/inbox" },
  { name: "Sent", path: "/main/sent" },
  { name: "Spam", path: "/main/spam" },
  { name: "Drafts", path: "/main/drafts" },
  { name: "Labels", path: "/main/labels" },
];

function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="logo-container">
        <img src={logo} alt="Bmail logo" className="logo" />
      </div>
      {links.map(({ name, path }) => (
        <NavLink
          key={name}
          to={path}
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          {name}
        </NavLink>
      ))}
    </nav>
  );
}

export default Sidebar;
