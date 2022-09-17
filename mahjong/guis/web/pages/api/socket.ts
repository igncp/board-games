import { NextApiRequest, NextApiResponse } from "next/types";

import { gameSocketConnector } from "../../lib/api/gameSocketConnector";
import { setUp } from "../../lib/api/socket";

export default (_req: NextApiRequest, res: NextApiResponse) => {
  // @ts-expect-error
  if (res.socket.server.io) {
    res.end();
    return;
  }

  setUp({
    res,
    onConnection: (socket) => {
      gameSocketConnector.onConnection(socket);
    },
  });

  res.end();
};
