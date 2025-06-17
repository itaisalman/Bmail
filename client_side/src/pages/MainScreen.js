import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import "./MainScreen.css";

function MainScreen() {
  return (
    <div className="main-container">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainScreen;

// import { useEffect, useState } from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from "../components/Sidebar/Sidebar";
// import "./MainScreen.css";

// function MainScreen() {
//   const [mails, setMails] = useState([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchMails = async () => {
//       const token = localStorage.getItem("token");

//       try {
//         const res = await fetch("/api/mails", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) {
//           const errData = await res.json();
//           throw new Error(errData?.error || "Failed to fetch mails");
//         }

//         const data = await res.json();
//         setMails(data.mails); // assuming response is { mails: [...] }
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     fetchMails();
//   }, []);

//   return (
//     <div className="main-container">
//       <Sidebar />
//       <main className="main-content">
//         {error && <p className="error-message">{error}</p>}
//         <Outlet context={{ mails }} />
//       </main>
//     </div>
//   );
// }

// export default MainScreen;
