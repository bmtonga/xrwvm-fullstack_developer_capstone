import React, { useState } from "react";
import "./Register.css";

import user_icon from "../assets/person.png";
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import close_icon from "../assets/close.png";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setlastName] = useState("");

  const gohome = (e) => {
    e.preventDefault();
    window.location.href = window.location.origin;
  };

  const register = async (e) => {
    e.preventDefault();

    const register_url = window.location.origin + "/djangoapp/register";

    try {
      const res = await fetch(register_url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: userName,
          password: password,
          firstName: firstName,
          lastName: lastName,
          email: email,
        }),
      });

      const json = await res.json();

      if (json.status === "Authenticated") {
        sessionStorage.setItem("username", json.userName);
        sessionStorage.setItem("firstname", json.firstName || '');
        sessionStorage.setItem("lastname", json.lastName || '');
        window.location.href = window.location.origin;
      } else if (json.error === "Already Registered") {
        alert("The user with the same username is already registered.");
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("A network error occurred while registering.");
    }
  };

  return (
    <div className="register_page">
      <div className="register_container">
        <div className="register_header">
          <div className="header_content">
            <span className="header_title">
              Create Your Account
            </span>
            <span className="header_subtitle">
              Join us and find your next vehicle
            </span>
          </div>

          <a
            href="/"
            onClick={gohome}
            className="close_button"
            aria-label="Close registration"
          >
            <img
              src={close_icon}
              alt="Close"
            />
          </a>
        </div>

        <form onSubmit={register}>
          <div className="inputs">
            {/* USERNAME */}
            <div className="input_group">
              <label htmlFor="username">Username</label>
              <div className="input_wrapper">
                <img src={user_icon} className="input_icon" alt="" />
                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  className="input_field"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* FIRST NAME */}
            <div className="input_group">
              <label htmlFor="first_name">First Name</label>
              <div className="input_wrapper">
                <img src={user_icon} className="input_icon" alt="" />
                <input
                  id="first_name"
                  type="text"
                  name="first_name"
                  placeholder="Enter your first name"
                  className="input_field"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                  required
                />
              </div>
            </div>

            {/* LAST NAME */}
            <div className="input_group">
              <label htmlFor="last_name">Last Name</label>
              <div className="input_wrapper">
                <img src={user_icon} className="input_icon" alt="" />
                <input
                  id="last_name"
                  type="text"
                  name="last_name"
                  placeholder="Enter your last name"
                  className="input_field"
                  value={lastName}
                  onChange={(e) => setlastName(e.target.value)}
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="input_group">
              <label htmlFor="email">Email Address</label>
              <div className="input_wrapper">
                <img src={email_icon} className="input_icon" alt="" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="input_field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="input_group">
              <label htmlFor="password">Password</label>
              <div className="input_wrapper">
                <img src={password_icon} className="input_icon" alt="" />
                <input
                  id="password"
                  name="psw"
                  type="password"
                  placeholder="Create a password"
                  className="input_field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
          </div>

          <div className="submit_panel">
            <button className="submit" type="submit">
              Create Account
            </button>
          </div>

          <div className="login_prompt">
            <span>Already have an account?</span>
            <a href="/login">Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;