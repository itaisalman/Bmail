import { useState } from "react";
import "./SignupScreen.css";
import logo from "../logo.jpg";

function SignupScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDay, setBirthDay] = useState("1");
  const [birthMonth, setBirthMonth] = useState("January");
  const [birthYear, setBirthYear] = useState("2000");
  const [gender, setGender] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Mapping month names to two-digit numbers – to build a date in dd/mm/yyyy format
  const monthMap = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };

  // The function that handles submitting the form
  const handleSignup = async (e) => {
    // Prevent page refresh
    e.preventDefault();

    // Construct a date of birth string in dd/mm/yyyy format
    const birth_date = `${birthDay.padStart(2, "0")}/${
      monthMap[birthMonth]
    }/${birthYear}`;

    // Pre-check required fields in the form
    const newErrors = {};
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!username) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";
    if (!gender) newErrors.gender = "Gender is required";
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // If there are errors – update the state and stop the submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Preparing the object to be sent to the server – including all necessary fields
    const payload = {
      first_name: firstName,
      last_name: lastName,
      birth_date,
      gender,
      username,
      password,
      image: "",
    };

    try {
      // Sending the request to the server
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      // Attempt to read the server response in JSON format
      const data = await res.json();

      if (res.status === 409) {
        setErrors({ username: "Username is already taken" });
        return;
      }

      // Server error handling – if the status is incorrect
      if (!res.ok) {
        const errorMessage = data?.error || "Signup failed";
        const newErrors = {};

        // Division by error message content – ​​associating the error with the relevant field
        if (errorMessage.toLowerCase().includes("username")) {
          newErrors.username = errorMessage;
        } else if (errorMessage.toLowerCase().includes("password")) {
          newErrors.password = errorMessage;
        } else {
          newErrors.general = errorMessage;
        }

        // Display errors to the user
        setErrors(newErrors);
        return;
      }
      // If everything is valid, reset errors and navigate to another screen
      setErrors({});
      window.location.href = "/main";
      // Communication error
    } catch (err) {
      setErrors({ general: "Server error: " + err.message });
    }
  };

  return (
    <div className="Signup">
      {/* Bmail logo at the top of the page */}
      <img src={logo} className="Bmail-logo" alt="logo" />

      {/* Main title */}
      <h1 className="header">Create a new account</h1>

      <form onSubmit={handleSignup} className="signup-form">
        {/* First name and last name fields on one line */}
        <div className="form-row">
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
          />
          {errors.firstName && (
            <p className="error-message">{errors.firstName}</p>
          )}
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
          />
          {errors.lastName && (
            <p className="error-message">{errors.lastName}</p>
          )}
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
          <label className="gender-option">
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={gender === "Female"}
              onChange={(e) => setGender(e.target.value)}
            />{" "}
            Female
          </label>
          <label className="gender-option">
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={gender === "Male"}
              onChange={(e) => setGender(e.target.value)}
            />{" "}
            Male
          </label>
          <label className="gender-option">
            <input
              type="radio"
              name="gender"
              value="Other"
              checked={gender === "Other"}
              onChange={(e) => setGender(e.target.value)}
            />{" "}
            Other
          </label>
          {errors.gender && <p className="error-message">{errors.gender}</p>}
        </div>

        {/* Username and password fields with option to display password */}
        <div className="password-row">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />

          {errors.username && (
            <p className="error-message">{errors.username}</p>
          )}

          <input
            value={password}
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          {errors.password && (
            <p className="error-message">{errors.password}</p>
          )}

          <input
            value={confirmPassword}
            type={showPassword ? "text" : "password"}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            className={
              password && confirmPassword && password !== confirmPassword
                ? "input-error"
                : ""
            }
          />
          {errors.confirmPassword && (
            <p className="error-message">{errors.confirmPassword}</p>
          )}

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
