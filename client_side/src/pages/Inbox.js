import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import "./Inbox.css";

const Inbox = () => <h1>Inbox</h1>;
const Sent = () => <h1>Sent</h1>;
const Spam = () => <h1>Spam</h1>;
const Drafts = () => <h1>Drafts</h1>;
const Labels = () => <h1>Labels</h1>;

function InboxScreen() {
  return (
    <div className="main-container">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route index element={<Navigate to="inbox" replace />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="sent" element={<Sent />} />
          <Route path="spam" element={<Spam />} />
          <Route path="drafts" element={<Drafts />} />
          <Route path="labels" element={<Labels />} />
          <Route path="*" element={<Navigate to="inbox" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default InboxScreen;
