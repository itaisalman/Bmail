import { Routes, Route } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen";
import SignupScreen from "./pages/SignupScreen";
import LoginScreen from "./pages/LoginScreen";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/signup" element={<SignupScreen />} />
      <Route path="/login" element={<LoginScreen />} />
    </Routes>
  );
}

export default App;
