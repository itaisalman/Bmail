import { Routes, Route } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen";
import SignupScreen from "./pages/SignupScreen";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/signup" element={<SignupScreen />} />
    </Routes>
  );
}

export default App;
