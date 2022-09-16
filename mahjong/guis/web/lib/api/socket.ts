import { Server, Socket } from "socket.io";

let io: Server;

export const setUp = ({
  res,
  onConnection,
}: {
  res: any;
  onConnection: (socket: Socket) => void;
}) => {
  if (!io) {
    io = new Server(res.socket.server);

    io.on("connection", onConnection);
  }

  res.socket.server.io = io;
};

export const getServer = (): Server => {
  return io;
};
