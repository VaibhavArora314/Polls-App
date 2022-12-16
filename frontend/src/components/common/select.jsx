import React from "react";

const Select = ({ name, label, error, options, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select name={name} id={name} className="form-control" {...rest}>
        <option value={""}>Select an option</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.description}
          </option>
        ))}
      </select>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Select;
