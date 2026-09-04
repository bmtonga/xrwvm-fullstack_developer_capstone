import React from "react";
import { useLocation } from "react-router-dom";
import "../assets/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Header = () => {
  const location = useLocation();
  const staticOrigin = window.location.port === "3000"
    ? "http://127.0.0.1:8000"
    : "";
  const logout = async (e) => {
    e.preventDefault();

    const logoutUrl = window.location.origin + "/djangoapp/logout";

    try {
      const res = await fetch(logoutUrl, {
        method: "GET",
        credentials: "include",
      });

      const json = await res.json();

      if (json) {
        const username = sessionStorage.getItem("username");

        sessionStorage.removeItem("username");
        sessionStorage.removeItem("firstname");
        sessionStorage.removeItem("lastname");

        alert("Logging out " + username + "...");

        window.location.href = window.location.origin;
      } else {
        alert("The user could not be logged out.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred while logging out.");
    }
  };

  // Get the username from the current session
  const curr_user = sessionStorage.getItem("username");

  // Default home page items
  let home_page_items = <div></div>;

  // If the user is logged in, show username and logout option
  if (curr_user !== null && curr_user !== "") {
    home_page_items = (
      <div className="input_panel">
        <span className="username">
          {curr_user}
        </span>

        <a
          className="nav_item"
          href="/"
          onClick={logout}
        >
          Logout
        </a>
      </div>
    );
  }

  return (
    <div>
      <nav
        className="navbar navbar-expand-lg navbar-light site-navbar"
      >
        <div className="container-fluid">

          <a className="logo" href={`${staticOrigin}/`}>
            Dealerships
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse"
            id="navbarText"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">

              <li className="nav-item">
                <a
                  className={`nav-link ${location.pathname === "/" || location.pathname.startsWith("/dealers") || location.pathname.startsWith("/dealer/") ? "active" : ""}`}
                  href={`${staticOrigin}/`}
                >
                  Home
                </a>
              </li>

              <li className="nav-item">
                <a
                  className={`nav-link ${location.pathname.startsWith("/about") ? "active" : ""}`}
                  href={`${staticOrigin}/about/`}
                >
                  About Us
                </a>
              </li>

              <li className="nav-item">
                <a
                  className={`nav-link ${location.pathname.startsWith("/contact") ? "active" : ""}`}
                  href={`${staticOrigin}/contact/`}
                >
                  Contact Us
                </a>
              </li>

            </ul>

            <span className="navbar-text">
              <div
                className="loginlink"
                id="loginlogout"
              >
                {home_page_items}
              </div>
            </span>

          </div>
        </div>
      </nav>

    </div>
  );
};
export default Header;