import { Manager } from "socket.io-client";

const manager = new Manager("http://localhost:5000", {
    reconnectionAttempts: 3,
    reconnectionDelay: 1000,
});

export const socket = manager.socket("/");
