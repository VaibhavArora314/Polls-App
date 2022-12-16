import { createContext, useEffect, useState } from "react";
import httpService from "../services/httpService";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [user, setUser] = useState(() =>
    authTokens && authTokens.access ? jwt_decode(authTokens.access) : {}
  );
  const [loading, setLoading] = useState(true);

  const login = async (username, password) => {
    try {
      const { data } = await httpService.post(`api/auth/jwt/create`, {
        username,
        password,
      });
      const decoded = jwt_decode(data.access);
      setUser(decoded);
      setAuthTokens(data);
      localStorage.setItem("authTokens", JSON.stringify(data));
    } catch (ex) {
      toast("Something went wrong while logging in");
      throw ex;
    }
  };

  const register = async (username, email, password) => {
    try {
      const { data } = await httpService.post(`auth/users/`, {
        username,
        email,
        password,
      });
      console.log("Registered");
      await login(username, password);
      console.log("Logged in");
    } catch (ex) {
      toast("Something unexpected occurred");
      throw ex;
    }
  };

  const logout = () => {
    setAuthTokens(null);
    setUser({});
    localStorage.removeItem("authTokens");
    window.location = "/login";
  };

  const updateToken = async () => {
    try {
      const { data } = await httpService.post(`api/auth/jwt/refresh`, {
        refresh: authTokens?.refresh,
      });
      setAuthTokens(data);
      const decoded = jwt_decode(data.access);
      setUser(decoded);
      localStorage.setItem("authTokens", JSON.stringify(data));
    } catch (ex) {
      if (ex.response.status === 401) {
        logout();
      } else {
        toast("An unexpected error occured");
      }
    }
  };

  useEffect(() => {
    if (authTokens) updateToken();
    setLoading(false);
  }, []);

  useEffect(() => {
    let timeInterval = 1000 * 60;
    const interval = setInterval(() => {
      if (authTokens) updateToken();
    }, timeInterval);
    return () => clearInterval(interval);
  }, [authTokens]);

  useEffect(() => {
    httpService.setJwt(authTokens?.access);
  }, [authTokens]);

  const contextData = {
    user,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// TODO: for all requests if response is 401(Unauthorized), logout user since tokens have expired
