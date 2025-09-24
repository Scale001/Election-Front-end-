import axios from "axios";

const responseBody = (response) => response.data;
const responseBlob = (response) => {
  console.log(response);
  return response.data;
};
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const tokem = localStorage.getItem("scalesToken");
  if (tokem) {
    config.headers["Authorization"] = `Bearer ${tokem}`;
  }
  return config;
});

const requests = {
  get: (url, params) => axios.get(url, { params }).then(responseBody),
  post: (url, body) =>
    axios.post(url, body).then((response) => responseBody(response)),
  put: (url, body) => axios.put(url, body).then(responseBody),
  delete: (url) => axios.delete(url).then(responseBody),
  patch: (url, body) => axios.patch(url, body).then(responseBody),
  postForm: (url, data) =>
    axios
      .post(url, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(responseBody),
  patchFileForm: (url, data) =>
    axios
      .patch(url, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(responseBody),
  patchForm: (url, data) => axios.patch(url, data).then(responseBody),
  processAudio: (url, data) =>
    axios
      .post(url, data, {
        responseType: "arraybuffer",
      })
      .then(responseBlob),
  processVideo: (url, data) =>
    axios
      .post(url, data, {
        responseType: "arraybuffer",
      })
      .then(responseBlob),
};

export const AccountApiRequest = {
  register: (body) => requests.post("account/register", body),
  googleAuth: (body) => requests.post("account/google-auth", body),
  login: (body) => requests.post("account/login", body),
  requestVerificationToken: (body) =>
    requests.post("account/request-verification-token", body),
  currentUser: () => requests.get("account/current-user"),
  requestPasswordResetMain: (body) =>
    requests.post("account/request-password-reset-mail", body),
  verifyEmail: (body) => requests.post("account/verify-email", body),
};

export const Elections = {
  addElection: (body) => requests.postForm("create-election", body),
  getElections: () => requests.get(`elections`),
  getSingleElections: (id) => requests.get(`elections/${id}`),
  castVote: (electionId, candidateId, userId) =>
    requests.post(`elections/${electionId}/candidates/${candidateId}/vote`, {
      id: userId,
    }),

  // processAudioMessage: (body) =>
  //   requests.processAudio("message/process/audio-message", body),
  // sendTextMessage: (body) => requests.post("message/send/text-message", body),
  // deleteMessage: (id) => requests.delete(`message/delete-message/${id}`),
  // deleteAllMessages: (username) =>
  //   requests.delete(`message/delete-all-message/${username}`),
  // seenMessage: (id) => requests.patch(`message/mark-message-as-read/${id}`),
  // favoriteMessages: (id) => requests.patch(`message/star-message/${id}`),
};
