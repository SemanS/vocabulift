import { io } from "socket.io-client";

const token = sessionStorage.getItem("access_token");

const baseUrl = import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT;

export const socket = io(baseUrl, {
  auth: {
    token: token,
  },
});
