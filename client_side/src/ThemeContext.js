import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState();

  const updateUserTheme = async (newTheme) => {
    const token = sessionStorage.getItem("jwt");
    if (!token) return;

    await fetch("/api/users/theme", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "bearer " + token,
      },
      body: JSON.stringify({ theme: newTheme }),
    });
  };

  useEffect(() => {
    const token = sessionStorage.getItem("jwt");
    if (!token) return;

    fetch("/api/users", {
      headers: {
        authorization: "bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.theme === "dark" || data.theme === "light") {
          setTheme(data.theme);
          document.body.className = data.theme;
          sessionStorage.setItem("theme", data.theme);
        }
      });
  }, []);
  // Function to switch between light and dark mode
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.className = newTheme;
    sessionStorage.setItem("theme", newTheme);
    updateUserTheme(newTheme);
  };

  // Returns the context for all application components that need the theme
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
