import React, { useContext } from "react";
import AuthContext from "../context/authContext";
import { Link, NavLink } from "react-router-dom";

const NavBar = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3 p-2 sticky-top">
      <Link className="navbar-brand" to="/">
        Navbar
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav me-auto">
          <NavLink className="nav-link" to="/polls">
            Polls
          </NavLink>
        </div>
        <div className="navbar-nav navbar-right">
          {(!user || !user.user_id) && (
            <React.Fragment>
              <NavLink className="nav-link ms-auto" to="/login">
                Login
              </NavLink>
              <NavLink className="nav-link" to="/register">
                Register
              </NavLink>
            </React.Fragment>
          )}
          {user && user.user_id && (
            <React.Fragment>
              <a className="nav-link ms-auto">{user.username}</a>
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
