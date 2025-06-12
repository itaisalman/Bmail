import { useState } from "react";
import "./SignupScreen.css";
import logo from "../logo.jpg";

function SignupScreen() {
  // State variables for the fields in the form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDay, setBirthDay] = useState("1");
  const [birthMonth, setBirthMonth] = useState("January");
  const [birthYear, setBirthYear] = useState("2000");
  const [gender, setGender] = useState("Male");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="Signup">
      {/* Bmail logo at the top of the page */}
      <img src={logo} className="Bmail-logo" alt="logo" />

      {/* Main title */}
      <h1 className="header">Create a new account</h1>

      <form className="signup-form">
        {/* First name and last name fields on one line */}
        <div className="form-row">
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
          />
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
          />
        </div>

        {/* Select date of birth: day, month, year */}
        <label className="section-label">Birth date</label>
        <div className="date-row">
          {/* Day */}
          <select
            value={birthDay}
            onChange={(e) => setBirthDay(e.target.value)}
          >
            {[...Array(31)].map((_, i) => (
              <option key={i}>{i + 1}</option>
            ))}
          </select>
          {/* Month */}
          <select
            value={birthMonth}
            onChange={(e) => setBirthMonth(e.target.value)}
          >
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((month, i) => (
              <option key={i}>{month}</option>
            ))}
          </select>
          {/* Year */}
          <select
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
          >
            {Array.from({ length: 100 }, (_, i) => 2025 - i).map((year) => (
              <option key={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Gender selection */}
        <label className="section-label">Gender</label>
        <div className="gender-row">
          <label>
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={gender === "Female"}
              onChange={(e) => setGender(e.target.value)}
            />{" "}
            Female
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={gender === "Male"}
              onChange={(e) => setGender(e.target.value)}
            />{" "}
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Other"
              checked={gender === "Other"}
              onChange={(e) => setGender(e.target.value)}
            />{" "}
            Other
          </label>
        </div>

        {/* Username and password fields with option to display password */}
        <div className="password-row">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            value={password}
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <label className="show-password-row">
            <input
              type="checkbox"
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            Show
          </label>
        </div>

        {/* Register button */}
        <div>
          <button type="submit" className="button">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignupScreen;
