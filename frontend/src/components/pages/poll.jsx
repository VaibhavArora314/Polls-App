import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/authContext";
import pollService from "../../services/pollService";
import Option from "../common/option";
import Modal from "react-modal";
import Vote from "../common/vote";
import { VerticalChart } from "../common/verticalChart";
import { BarChart } from "../common/barChart";
import Loading from "../common/loading";

Modal.setAppElement("#root");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

function Poll(props) {
  const pollId = props.match.params.id;
  const [poll, setPoll] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const updatePoll = async () => {
    try {
      const { data } = await pollService.getPoll(pollId);
      setPoll(data);
    } catch (ex) {
      if (ex.response && ex.response.status) logout();
    }
  };

  useEffect(() => {
    async function getPoll() {
      try {
        const { data } = await pollService.getPoll(pollId);
        setPoll(data);
        if (loading) setLoading(false);
      } catch (ex) {
        if (ex.response.status === 404) {
          console.log("Poll not found");
          setPoll(null);
        }
        if (loading) setLoading(false);
      }
    }

    if (loading) {
      getPoll();
    }

    const interval = setInterval(getPoll, 30 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [poll, loading]);

  if (loading) return <Loading height="60" />;

  const optionColours = ["primary", "secondary", "success", "info", "warning"];

  if (poll && poll.id) {
    return (
      <div className="container">
        <div className="row bg-light p-4 border rounded-4 border-white">
          <div className="row m-1 mt-0">{poll.description}</div>
          <div className="row">
            {poll.options?.map((option, index) => (
              <Option
                colour={optionColours[index % optionColours.length]}
                key={index}
                option={option}
              />
            ))}
            <div className="row">
              <div className="col-md-4 col-sm-12">
                <p>Created By: {poll.username}</p>
                <p>
                  Total Votes:{" "}
                  {poll.options
                    ? poll.options.reduce((p, c) => p + c.votes_count, 0)
                    : 0}
                </p>
              </div>
              <div className="col-md-4 col-sm-12">
                <p className="m-1 text-start">Status: {poll.time_left}</p>
              </div>
              <div className="col-md-4 col-sm-12 text-end p-0">
                {user && user.user_id && !poll.ended && (
                  <button
                    className="btn btn-primary m-1"
                    onClick={() => {
                      setIsOpen(true);
                    }}
                  >
                    Vote
                  </button>
                )}
                {(!user || !user.user_id) && (
                  <p className="m-2 mx-0 px-0">You must be logged in to vote</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="row m-5">
          {((poll && poll.live_results) || poll.ended) && (
            <React.Fragment>
              <div className="col-md-8 col-sm-12 my-1 d-md-block d-none">
                <VerticalChart
                  dataToShow={poll.options}
                  label="Votes"
                  labelField="description"
                  dataField="votes_count"
                />
                <p className="text-center">Vertical Chart</p>
              </div>
              <div className="col-md-4 col-sm-12 my-1">
                <BarChart
                  dataToShow={poll.options}
                  label="Votes"
                  labelField="description"
                  dataField="votes_count"
                />
                <p className="text-center">Pie Chart</p>
              </div>
            </React.Fragment>
          )}
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setIsOpen(false)}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="container" style={{ width: "40vw" }}>
            <button
              className="btn btn-primary"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
            <Vote poll={poll} setIsOpen={setIsOpen} updatePoll={updatePoll} />
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div>
      <p>Looks like no such poll does not exists.</p>
    </div>
  );
}

export default Poll;
