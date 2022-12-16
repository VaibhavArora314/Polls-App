import httpService from "./httpService";

const apiEndPoint = "api/votes/";

export function getVoteData(pollId) {
  return httpService.get(`${apiEndPoint}${pollId}`);
}

export function vote(pollId, optionId, userId) {
  return httpService.post(apiEndPoint, {
    poll: pollId,
    option: optionId,
    user: userId,
  });
}

export function changeVote(pollId, optionId, userId) {
  return httpService.put(`${apiEndPoint}${pollId}/`, {
    poll: pollId,
    option: optionId,
    user: userId,
  });
}

export default {
  getVoteData,
  vote,
};
