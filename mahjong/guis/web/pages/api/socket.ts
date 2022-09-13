import { Server } from "socket.io";

export default function SocketHandler(_req, res) {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  const onConnection = (socket) => {
    socket.on("createdMessage", (msg) => {
      socket.broadcast.emit("newIncomingMessage", msg);
    });
  };

  io.on("connection", onConnection);

  res.end();
}
