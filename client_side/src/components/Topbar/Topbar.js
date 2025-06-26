import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../ThemeContext";
import { FaSearch } from "react-icons/fa";
import "./Topbar.css";
import LiveSearchResult from "../LiveSearchResult/LiveSearchResult";

function Topbar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { toggleTheme } = useContext(ThemeContext);
  const [isFocused, setIsFocused] = useState(false);

  const handleOnFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  const fetchTopbar = async () => {
    try {
      const token = sessionStorage.getItem("jwt");
      if (!token) return;
      const res = await fetch("/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "bearer " + token,
        },
      });
      if (!res.ok) throw new Error("Faild to load user");
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Error loading inbox: " + err.message);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("jwt");
    navigate("/login");
  };

  const handleChange = (e, value) => {
    setResults(null);
    setQuery(value);
    if (value) {
      handleSearch(e, value);
    }
  };

  const handleSearch = async (e, value) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("jwt");
      if (!token) return;
      console.log(value);
      const res = await fetch(
        // Used encodeURIComponent in order to search for anything the user wants without misbehaviour
        `/api/mails/search/${encodeURIComponent(value)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: "bearer " + token,
          },
        }
      );
      const data = await res.json();
      setResults(data);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchTopbar();
  }, []);

  return (
    <div className="inbox-header">
      {user && (
        <>
          <img
            src={`http://localhost:3000/${user.image}`}
            alt="Profile"
            className="profile-image"
          />
          <span className="username">{user.first_name}</span>
        </>
      )}
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search in email"
            className="search-input"
            value={query}
            onChange={(e) => handleChange(e, e.target.value)}
            onFocus={handleOnFocus}
            onBlur={() => setTimeout(handleBlur, 150)}
          />
          <button type="submit" className="search-button" aria-label="Search">
            <FaSearch />
          </button>
        </form>

        {isFocused && (
          <LiveSearchResult
            results={results}
            isLoading={query?.length && !results}
          />
        )}
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <button className="theme-toggle-button" onClick={toggleTheme}>
        🔆
      </button>
    </div>
  );
}

export default Topbar;
