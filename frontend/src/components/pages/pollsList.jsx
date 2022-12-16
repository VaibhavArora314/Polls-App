import React, { useContext, useEffect, useState } from "react";
import pollService from "../../services/pollService";
import { Link } from "react-router-dom";
import AuthContext from "../../context/authContext";
import Item from "../common/item";
import Pagination from "../common/pagination";
import SearchField from "../common/searchField";
import ListGroup from "../common/listGroup";

function PollsList(props) {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useContext(AuthContext);
  const [selectedState, setSelectedState] = useState("");
  const [sortingQuery, setSortingQuery] = useState("");

  const states = [
    { title: "All", value: "" },
    { title: "Active", value: "active" },
    { title: "Ends within next 1hr", value: "hour" },
    { title: "Ends within next 24hr", value: "day" },
    { title: "Ends within next 7days", value: "week" },
    { title: "Ended", value: "ended" },
  ];

  const sorting = [
    { title: "Sorting", value: "" },
    { title: "Least time remaining on top", value: "inc" },
    { title: "Most time remaining on top", value: "dec" },
  ];

  useEffect(() => {
    async function getPolls() {
      const { data } = await pollService.getPolls();
      setPolls(data);
    }

    if (loading) {
      getPolls();
      setLoading(false);
    }

    const interval = setInterval(getPolls, 30 * 1000);

    return () => clearInterval(interval);
  }, [polls, loading]);

  if (loading) return;

  let filteredData = polls;
  if (searchQuery) {
    filteredData = filteredData.filter(
      (poll) =>
        poll.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poll.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  if (selectedState === "active") {
    filteredData = filteredData.filter((poll) => !poll.ended);
  }
  if (selectedState === "ended") {
    filteredData = filteredData.filter((poll) => poll.ended);
  }
  if (selectedState === "week") {
    filteredData = filteredData.filter((poll) => {
      if (poll.ended) return false;
      if (
        poll.time_left.includes("day") &&
        Number(poll.time_left.slice(0, 2)) >= 7
      )
        return false;
      return true;
    });
  }
  if (selectedState === "day") {
    filteredData = filteredData.filter(
      (poll) => !poll.ended && !poll.time_left.includes("day")
    );
  }
  if (selectedState === "hour") {
    filteredData = filteredData.filter(
      (poll) =>
        !poll.ended &&
        !poll.time_left.includes("hour") &&
        !poll.time_left.includes("day")
    );
  }

  const priority = ({ ended, time_left }) => {
    if (ended) return 0;
    if (time_left.includes("day")) return 1;
    if (time_left.includes("hour")) return 2;
    if (time_left.includes("minutes")) return 3;
    return 4;
  };

  let sortedData = filteredData;

  if (sortingQuery == "inc")
    filteredData.sort((poll1, poll2) => {
      if (priority(poll1) != priority(poll2))
        return priority(poll1) < priority(poll2) ? 1 : -1;
      const poll1Time = Number(poll1.time_left.slice(0, 2)),
        poll2Time = Number(poll2.time_left.slice(0, 2));
      if (poll1Time != poll2Time) return poll1Time > poll2Time ? 1 : -1;
      return 0;
    });
  if (sortingQuery == "dec")
    filteredData.sort((poll1, poll2) => {
      if (priority(poll1) != priority(poll2))
        return priority(poll1) > priority(poll2) ? 1 : -1;
      const poll1Time = Number(poll1.time_left.slice(0, 2)),
        poll2Time = Number(poll2.time_left.slice(0, 2));
      if (poll1Time != poll2Time) return poll1Time < poll2Time ? 1 : -1;
      return 0;
    });

  const startIndex = (currentPage - 1) * pageSize,
    endIndex = currentPage * pageSize;
  const paginatedData =
    endIndex < filteredData.length
      ? filteredData.slice(startIndex, endIndex)
      : filteredData.slice(startIndex);

  const pageData = paginatedData;

  return (
    <React.Fragment>
      <div className="row">
        <div className="col">
          <div className="row">
            <div className="col">
              <SearchField
                searchQuery={searchQuery}
                handleChange={({ currentTarget: input }) => {
                  setSearchQuery(input.value);
                  setCurrentPage(1);
                }}
                label="Enter text to search (Poll description or Username)"
              />
            </div>
            {user && user.user_id && (
              <div className="col-auto text-end">
                <Link className="btn btn-primary" to="/create-poll">
                  Create Poll
                </Link>
              </div>
            )}
          </div>

          {pageData.map((poll) => (
            <Item key={poll.id} poll={poll} />
          ))}
          <Pagination
            itemsCount={filteredData.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
            currentPage={currentPage}
          />
        </div>
        <div className="col-3">
          <span className="m-1 mt-0">
            <ListGroup
              items={states}
              textProperty="title"
              valueProperty="value"
              selectedItem={selectedState}
              onItemSelect={(item) => {
                setSelectedState(item.value);
                setCurrentPage(1);
              }}
            />
          </span>
          <span className="m-1">
            <ListGroup
              items={sorting}
              textProperty="title"
              valueProperty="value"
              selectedItem={sortingQuery}
              onItemSelect={(item) => {
                setSortingQuery(item.value);
                setCurrentPage(1);
                if (selectedState === "ended") setSelectedState("");
              }}
            />
          </span>
        </div>
      </div>
    </React.Fragment>
  );
}

export default PollsList;
