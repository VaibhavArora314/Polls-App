import React from "react";
import { Link } from "react-router-dom";

function Item({ poll }) {
  return (
    <div className="row bg-light border border-white rounded-4 p-2 my-3">
      <div className="row mb-2">
        <div className="col-12 text-wrap text-break">
          {poll.description.slice(0, 100)}
          {poll.description.length > 100 && "...."}
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <div className="col-auto text-start me-2">
            <p className="m-0 p-1 px-0">Created by {poll.username}</p>
          </div>
          <div className="col-auto text-start">
            <p className="m-0 p-1 px-0">Status: {poll.time_left}</p>
          </div>
        </div>
        <div className="col-6 ms-auto text-end mb-1">
          <Link to={"/polls/" + poll.id} className="btn btn-primary">
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Item;
