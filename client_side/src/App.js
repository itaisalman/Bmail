import { Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import Draft from "./components/Draft/Draft";
import InboxScreen from "./components/Inbox/Inbox";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import HomeScreen from "./pages/HomeScreen";
import LoginScreen from "./pages/LoginScreen";
import MainScreen from "./pages/MainScreen";
import SignupScreen from "./pages/SignupScreen";

// Temporary components
const Sent = () => <h1>Sent</h1>;
const Spam = () => <h1>Spam</h1>;
const Labels = () => <h1>Labels</h1>;
const Starred = () => <h1>Starred</h1>;
const Important = () => <h1>Important</h1>;

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <MainScreen />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="inbox" replace />} />
          <Route path="inbox" element={<InboxScreen />} />
          <Route path="sent" element={<Sent />} />
          <Route path="spam" element={<Spam />} />
          <Route path="drafts" element={<Draft />} />
          <Route path="labels" element={<Labels />} />
          <Route path="starred" element={<Starred />} />
          <Route path="important" element={<Important />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
