import { Routes, Route } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
    </Routes>
  );
}

export default App;
