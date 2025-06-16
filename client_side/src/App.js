// import { Routes, Route } from "react-router-dom";
// import HomeScreen from "./pages/HomeScreen";
// import SignupScreen from "./pages/SignupScreen";
// import LoginScreen from "./pages/LoginScreen";
// import MainScreen from "./pages/MainScreen"; // adjust path as needed

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<HomeScreen />} />
//       <Route path="/signup" element={<SignupScreen />} />
//       <Route path="/login" element={<LoginScreen />} />
//       <Route path="/main" element={<MainScreen />} /> {/* Add this line */}
//     </Routes>
//   );
// }

// export default App;

import { Routes, Route } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen";
import SignupScreen from "./pages/SignupScreen";
import LoginScreen from "./pages/LoginScreen";
import MainScreen from "./pages/MainScreen";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/signup" element={<SignupScreen />} />
      <Route path="/login" element={<LoginScreen />} />

      {/* Just one clean route for /main */}
      <Route path="/main/*" element={<MainScreen />} />
    </Routes>
  );
}

export default App;
