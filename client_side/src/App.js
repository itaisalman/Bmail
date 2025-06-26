import { Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import Draft from "./components/Draft/Draft";
import InboxScreen from "./components/Inbox/Inbox";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import HomeScreen from "./pages/HomeScreen";
import LoginScreen from "./pages/LoginScreen";
import MainScreen from "./pages/MainScreen";
import SignupScreen from "./pages/SignupScreen";
import LabelView from "./components/Labels/LabelView";
import StarredScreen from "./components/Star/Star";
import ImportantScreen from "./components/Important/Important";
import TrashScreen from "./components/Trash/Trash";
import ViewResult from "./components/ViewResult/ViewResult";

// Temporary components
const Sent = () => <h1>Sent</h1>;
const Spam = () => <h1>Spam</h1>;

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

          <Route path="inbox" element={<InboxScreen />}>
            <Route path=":id" element={<ViewResult />} />
          </Route>

          <Route path="sent" element={<Sent />}>
            <Route path=":id" element={<ViewResult />} />
          </Route>

          <Route path="spam" element={<Spam />}>
            <Route path=":id" element={<ViewResult />} />
          </Route>

          <Route path="drafts" element={<Draft />}>
            <Route path=":id" element={<ViewResult />} />
          </Route>

          <Route path="starred" element={<StarredScreen />}>
            <Route path=":id" element={<ViewResult />} />
          </Route>

          <Route path="important" element={<ImportantScreen />}>
            <Route path=":id" element={<ViewResult />} />
          </Route>

          <Route path="trash" element={<TrashScreen />}>
            <Route path=":id" element={<ViewResult />} />
          </Route>

          <Route path="labels/:labelName" element={<LabelView />}>
            <Route path=":id" element={<ViewResult />} />
          </Route>
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
