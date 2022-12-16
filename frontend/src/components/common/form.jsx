import React, { Component } from "react";
import Joi from "joi";
import Input from "./input";
import Select from "./select";
import Checkbox from "./checkbox";

// Extend your form components from this class rather than Component Class
// Make sure that your form components have following things:
// 1. Initialize state
// 2. Set schema (as normal JS obj)
// 3. define doSubmit method to determine what should happen on submission
// 4. define render method, the form used here should have onSubmit = {this.handleSubmit}
// Also, you can use helper methods for rendering
// 1. renderInput(name, label, type = "text")
//      a. name is for the property in data in state
//      b. label is for the label to show with input field
//      c. type is for type of label, by default it is set to text
// 2. renderSelect
// 3. renderButton(label) - This button is disabled if the data is invalid
//      label is for the content inside button

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  schema = {
    // write your schema in this like followig example
    // username: Joi.string().required().label("Username"),
    // password: Joi.string().required().label("Password"),
  };

  validate = () => {
    const { error } = Joi.object(this.schema).validate(
      { ...this.state.data },
      { abortEarly: false }
    );

    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = Joi.object({ [name]: this.schema[name] });
    const { error } = schema.validate(obj);

    return error ? error.details[0].message : null;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  doSubmit = () => {
    // Write you submission logic in this method
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  renderButton = (label) => {
    return (
      <button disabled={this.validate()} className="btn btn-primary my-1">
        {label}
      </button>
    );
  };

  renderInput = (name, label, type = "text") => {
    const { data, errors } = this.state;

    return (
      <Input
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  };

  renderSelect = (name, label, options) => {
    const { data, errors } = this.state;

    return (
      <Select
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
        options={options}
      />
    );
  };

  renderCheck = (name, label) => {
    const { data } = this.state;

    return (
      <Checkbox
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleCheckBoxChange}
        // error={errors[name]}
      />
    );
  };

  handleCheckBoxChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    data[input.name] = data[input.name] == true ? false : true;
    this.setState({ data });
  };

  renderListInput = (name, label, index, type = "text") => {
    const { data, errors } = this.state;

    return (
      <Input
        type={type}
        name={name}
        value={data[name[index]]}
        label={label}
        onChange={(e) => this.handleChange(e, index)}
        error={errors[name[index]]}
      />
    );
  };
}

export default Form;
