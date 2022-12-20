import React, { Component } from "react";
import Form from "./form";
import { getVoteData, vote, changeVote } from "../../services/voteService";
import Joi from "joi";
import AuthContext from "../../context/authContext";
import { toast } from "react-toastify";
import Loading from "./loading";

class Vote extends Form {
  state = {
    data: {
      optionId: "",
    },
    errors: "",
    changeVote: false,
    originalVote: null,
    loading: true,
  };

  static contextType = AuthContext;

  schema = {
    optionId: Joi.string().required().label("Option"),
  };

  componentDidMount = async () => {
    try {
      const { data } = await getVoteData(this.props.poll.id);
      const option = this.props.poll.options.find(
        (option) => option.id === data.option
      );
      this.setState({
        data: { optionId: option.id },
        changeVote: true,
        originalVote: option.id,
        loading: false,
      });
    } catch (ex) {
      console.log(ex);
      if (ex.response && ex.response.status === 404)
        this.setState({ data: { optionId: "" } });
      else if (ex.response && ex.response.status === 401) {
        this.context.logout();
        toast.error("Session expired");
      } else {
        toast.error("An unexpected errror occured!");
      }
      this.setState({ loading: false });
    }
  };

  doSubmit = async () => {
    try {
      this.setState({ loading: true });
      if (this.state.changeVote) {
        await changeVote(
          this.props.poll.id,
          Number(this.state.data.optionId),
          this.context.user.user_id
        );
      } else {
        await vote(
          this.props.poll.id,
          Number(this.state.data.optionId),
          this.context.user.user_id
        );
      }
      await this.props.updatePoll();
      this.props.setIsOpen(false);
      toast.success("Successfully Voted.");
    } catch (ex) {
      if (ex.response && ex.response.status === 401) {
        this.context.logout();
        toast.error("Session expired");
      } else {
        toast.error("An unexpected errror occured!");
      }
      this.setState({ loading: false });
    }
  };

  render() {
    if (this.state.loading) return <Loading height="20" />;

    return (
      <form onSubmit={this.handleSubmit}>
        {this.renderSelect("optionId", "Options", this.props.poll.options)}
        <button
          disabled={
            (!this.state.originalVote &&
              Number(this.state.data.optionId) == this.state.originalVote) ||
            this.validate()
          }
          className="btn btn-primary my-1"
        >
          {this.state.changeVote && "Change "}Vote
        </button>
      </form>
    );
  }
}

export default Vote;
