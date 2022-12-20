import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthContext from "../../context/authContext";
import Form from "../common/form";
import Joi from "joi";
import { toast } from "react-toastify";
import Loading from "../common/loading";

export default class Login extends Form {
  state = {
    data: {
      username: "",
      password: "",
    },
    errors: {},
    loading: false,
  };

  static contextType = AuthContext;

  schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  };

  doSubmit = async () => {
    try {
      this.setState({ loading: true });
      const { username, password } = this.state.data;
      await this.context.login(username, password);
      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data.username;
        errors.password = ex.response.data.password;
        this.setState({ errors });
      } else if (ex.response && ex.response.status === 401) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data.detail;
        this.setState({ errors });
      } else {
        toast.error("An unexpected error occured");
      }
      this.setState({ loading: false });
    }
  };

  render() {
    if (this.state.loading) return <Loading height="60" />;

    if (this.context.user && this.context.user.user_id)
      return <Redirect to="/" />;

    return (
      <div>
        <h3>Login</h3>
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              {this.renderInput("username", "Username")}
            </div>
            <div className="col-md-6">
              {this.renderInput("password", "Password", "password")}
            </div>
          </div>
          {this.renderButton("Login")}
        </form>
      </div>
    );
  }
}
