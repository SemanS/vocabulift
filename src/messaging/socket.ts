import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "production"
    ? undefined // production URL goes here
    : "http://localhost:3000";

export const socket = io(URL);
