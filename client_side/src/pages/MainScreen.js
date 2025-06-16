import { NavLink, Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./MainScreen.css";
import logo from "../logo.jpg"; // adjust path if needed

const sidebarLinks = [
  { name: "Inbox", path: "/main/inbox" },
  { name: "Sent", path: "/main/sent" },
  { name: "Spam", path: "/main/spam" },
  { name: "Drafts", path: "/main/drafts" },
  { name: "Labels", path: "/main/labels" },
];

const Inbox = () => <h1>Inbox</h1>;
const Sent = () => <h1>Sent</h1>;
const Spam = () => <h1>Spam</h1>;
const Drafts = () => <h1>Drafts</h1>;
const Labels = () => <h1>Labels</h1>;

export default function MainScreen() {
  return (
    <div className="container">
      <nav className="sidebar">
        <div className="logo-container">
          <img src={logo} alt="Bmail logo" className="logo" />
        </div>
        {sidebarLinks.map(({ name, path }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {name}
          </NavLink>
        ))}
      </nav>
      <main className="content">
        <Routes>
          <Route index element={<Navigate to="inbox" replace />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="sent" element={<Sent />} />
          <Route path="spam" element={<Spam />} />
          <Route path="drafts" element={<Drafts />} />
          <Route path="labels" element={<Labels />} />
          {/* Optional: catch all redirect to inbox */}
          <Route path="*" element={<Navigate to="inbox" replace />} />
        </Routes>
      </main>
    </div>
  );
}
