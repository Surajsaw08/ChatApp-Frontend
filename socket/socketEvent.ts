import { getSocket } from "./socket";

export const testSocket = (payload: any, off: boolean = false) => {
  const socket = getSocket();

  if (!socket) {
    console.log("Socket is not connect");
  }

  if (off) {
    socket?.off("testSocket", payload);
  } else if (typeof payload == "function") {
    socket?.on("testSocket", payload); //payload as callback for this event
  } else {
    socket?.emit("testSocket", payload); //sendind payload as data
  }
};

export const updateProfile = (payload: any, off: boolean = false) => {
  const socket = getSocket();

  if (!socket) {
    console.log("Socket is not connect");
  }

  if (off) {
    socket?.off("updateProfile", payload);
  } else if (typeof payload == "function") {
    socket?.on("updateProfile", payload); //payload as callback for this event
  } else {
    socket?.emit("updateProfile", payload); //sending payload as data
  }
};
