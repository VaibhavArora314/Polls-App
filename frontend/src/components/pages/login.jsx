import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthContext from "../../context/authContext";
import Form from "../common/form";
import Joi from "joi";
import { toast } from "react-toastify";

export default class Login extends Form {
  state = {
    data: {
      username: "",
      password: "",
    },
    errors: {},
  };

  static contextType = AuthContext;

  schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  };

  doSubmit = async () => {
    try {
      const { username, password } = this.state.data;
      await this.context.login(username, password);
      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
        toast.error("An error occurred");
      } else if (ex.response && ex.response.status === 401) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data.detail;
        this.setState({ errors });
        toast.error("An error occurred");
      } else {
        toast.error("An unexpected error occured");
      }
    }
  };

  render() {
    if (this.context.user && this.context.user.user_id)
      return <Redirect to="/" />;

    return (
      <div>
        <h3>Login</h3>
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col-6">
              {this.renderInput("username", "Username")}
            </div>
            <div className="col-6">
              {this.renderInput("password", "Password", "password")}
            </div>
          </div>
          {this.renderButton("Login")}
        </form>
      </div>
    );
  }
}
