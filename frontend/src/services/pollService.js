import httpService from "./httpService";

const apiEndPoint = "api/polls/";

export function createPoll(
  user,
  description,
  live_results,
  time_period,
  options
) {
  const payload = {
    user,
    description,
    live_results,
    time_period,
    options,
  };
  return httpService.post(apiEndPoint, payload);
}

export function getPolls() {
  return httpService.get(apiEndPoint);
}

export function getPoll(id) {
  return httpService.get(`${apiEndPoint}${id}/`);
}

export default {
  getPolls,
  getPoll,
  createPoll,
};
