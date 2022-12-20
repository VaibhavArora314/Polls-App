import React, { useContext } from "react";
import AuthContext from "../context/authContext";
import { Link, NavLink } from "react-router-dom";

const NavBar = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3 p-2 sticky-top">
      <Link className="navbar-brand me-1" to="/">
        Home
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <div className="navbar-nav navbar-right">
          <NavLink className="nav-link" to="/polls">
            Polls
          </NavLink>
          {(!user || !user.user_id) && (
            <React.Fragment>
              <NavLink className="nav-link" to="/login">
                Login
              </NavLink>
              <NavLink className="nav-link" to="/register">
                Register
              </NavLink>
            </React.Fragment>
          )}
          {user && user.user_id && (
            <React.Fragment>
              <a className="nav-link">{user.username}</a>
              <NavLink className="nav-link" to="/logout">
                Logout
              </NavLink>
            </React.Fragment>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
