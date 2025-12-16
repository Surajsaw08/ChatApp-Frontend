import { getSocket } from "./socket";

export const testSocket = (payload: any, off: boolean = false) => {
  const socket = getSocket();

  if (!socket) {
    console.log("Socket is ni=ot connect");
  }

  if (off) {
    socket?.off("testSocket", payload);
  } else if (typeof payload == "function") {
    socket?.on("testSocket", payload); //payload as callback for this event
  } else {
    socket?.emit("testSocket", payload); //sendind payload as data
  }
};
