import { Routes, Route, Navigate } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen";
import SignupScreen from "./pages/SignupScreen";
import LoginScreen from "./pages/LoginScreen";
import MainScreen from "./pages/MainScreen";

// I added these just to see how the sidebar response
// When we will implement the pages, we will import the components and use them
// This is temporary
const Inbox = () => <h1>Inbox</h1>;
const Sent = () => <h1>Sent</h1>;
const Spam = () => <h1>Spam</h1>;
const Drafts = () => <h1>Drafts</h1>;
const Labels = () => <h1>Labels</h1>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/signup" element={<SignupScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/main" element={<MainScreen />}>
        <Route index element={<Navigate to="inbox" replace />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="sent" element={<Sent />} />
        <Route path="spam" element={<Spam />} />
        <Route path="drafts" element={<Drafts />} />
        <Route path="labels" element={<Labels />} />
      </Route>
    </Routes>
  );
}

export default App;
