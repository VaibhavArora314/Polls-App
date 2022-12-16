import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import AuthContext from "../../context/authContext";

function Logout(props) {
  const { user, logout } = useContext(AuthContext);
  if (user && user.user_id) logout();

  return <Redirect to="/login" />;
}

export default Logout;
