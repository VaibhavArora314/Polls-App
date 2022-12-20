import "./App.css";
import { Switch, Route, Redirect } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import CreatePoll from "./components/pages/createPoll";
import Login from "./components/pages/login";
import Poll from "./components/pages/poll";
import PollsList from "./components/pages/pollsList";
import ProtectedRoute from "./components/common/protectedRoute";
import Register from "./components/pages/register";
import NavBar from "./components/navbar";
import Logout from "./components/pages/logout";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="container min-vh-100">
      <AuthProvider>
        <NavBar />
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/logout" component={Logout} />
          <Route path="/polls/:id" component={Poll} />
          <Route path="/polls" component={PollsList} />
          <ProtectedRoute path="/create-poll" component={CreatePoll} />
          <Redirect from="/" to="/polls" />
        </Switch>
        <ToastContainer />
      </AuthProvider>
    </div>
  );
}

export default App;
