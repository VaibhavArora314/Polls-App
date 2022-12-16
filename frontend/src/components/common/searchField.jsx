import React from "react";

function SearchField({ searchQuery, handleChange, label }) {
  return (
    <div>
      <input
        type="text"
        className="form-control"
        name="search"
        id="seacrh"
        value={searchQuery}
        onChange={handleChange}
        placeholder={label}
      />
    </div>
  );
}

export default SearchField;
