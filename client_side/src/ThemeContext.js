import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = sessionStorage.getItem("theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      // If the user has already chosen a theme – we will use it
      setTheme(savedTheme);
      document.body.className = savedTheme;
    } else {
      // Otherwise (first time), we will keep the default 'light'
      sessionStorage.setItem("theme", "light");
      document.body.className = "light";
    }
  }, []);

  // Function to switch between light and dark mode
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.className = newTheme;
    sessionStorage.setItem("theme", newTheme);
  };

  // Returns the context for all application components that need the theme
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
