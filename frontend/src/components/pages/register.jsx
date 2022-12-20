import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthContext from "../../context/authContext";
import Form from "../common/form";
import Joi from "joi";
import { toast } from "react-toastify";
import Loading from "../common/loading";

export default class Register extends Form {
  state = {
    data: {
      email: "",
      username: "",
      password: "",
    },
    errors: {},
    loading: false,
  };

  static contextType = AuthContext;

  schema = {
    email: Joi.string().required().label("Email").max(100).min(5),
    username: Joi.string().required().label("Username").max(100).min(5),
    password: Joi.string().required().label("Password").max(100).min(8),
  };

  doSubmit = async () => {
    try {
      this.setState({ loading: true });
      const { username, email, password } = this.state.data;
      await this.context.register(username, email, password);
      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        console.log(errors);
        console.log(ex.response);
        errors.username = ex.response.data.username;
        errors.email = ex.response.data.email;
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
        <h3>Register</h3>
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col-lg-4 col-md-6">
              {this.renderInput("username", "Username")}
            </div>
            <div className="col-lg-4 col-md-6">
              {this.renderInput("email", "Email", "email")}
            </div>
            <div className="col-lg-4 col-md-6">
              {this.renderInput("password", "Password", "password")}
            </div>
          </div>
          {this.renderButton("Register")}
        </form>
      </div>
    );
  }
}
