import { useState, useEffect, useContext, useRef } from "react";
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
  const debounceRef = useRef(null);
  const searchRef = useRef(null);

  // Fetch the current user data on mount
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

  // Handle search input changes
  const handleChange = (value) => {
    setResults(null);
    setQuery(value);
    if (value) {
      debounceSearch(value);
    }
  };

  // Fetch search results from server
  const searchMails = async (value) => {
    try {
      const token = sessionStorage.getItem("jwt");
      const res = await fetch(
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

  // Submit search manually (form submit)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleChange(query);
  };

  // Debounce typing to avoid excessive requests
  const debounceSearch = (value) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchMails(value);
    }, 300);
  };

  useEffect(() => {
    console.log("Updated results:", results);
  }, [results]);

  useEffect(() => {
    fetchTopbar();

    // Handle focus and blur across the entire search container
    const handleFocusIn = (e) => {
      if (searchRef.current && searchRef.current.contains(e.target)) {
        setIsFocused(true);
      }
    };

    const handleFocusOut = (e) => {
      // Timeout ensures clicks inside dropdown aren't lost
      setTimeout(() => {
        if (
          searchRef.current &&
          !searchRef.current.contains(document.activeElement)
        ) {
          setIsFocused(false);
        }
      }, 100);
    };

    // Attach focus listeners to the whole document
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    // Clean up when component unfocused
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
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
      <div className="search-container" ref={searchRef}>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search in email"
            className="search-input"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
          />
          <button type="submit" className="search-button" aria-label="Search">
            <FaSearch />
          </button>
        </form>

        {isFocused && (
          <LiveSearchResult
            results={results}
            isLoading={query?.length && !results}
            setQuery={setQuery}
            setResults={setResults}
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
