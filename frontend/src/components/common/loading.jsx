import React from "react";
import ReactLoading from "react-loading";

function Loading({ height }) {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: `${height}vh` }}
    >
      <ReactLoading
        type={"bars"}
        color={"#36a2ebde"}
        height={"10%"}
        width={"10%"}
      />
    </div>
  );
}

export default Loading;
