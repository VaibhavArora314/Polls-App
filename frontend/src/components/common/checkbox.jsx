import React from "react";

const Checkbox = ({ name, label, error, ...rest }) => {
  return (
    <div className="form-check">
      <label className="form-check-label" htmlFor={name}>
        {label}
      </label>
      <input
        name={name}
        id={name}
        className="form-check-input"
        type="checkbox"
        {...rest}
      />
    </div>
  );
};

export default Checkbox;
