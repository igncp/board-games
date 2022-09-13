import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

import io from "socket.io-client";

const Game = () => {
  const router = useRouter();
  const socket = useRef(null);

  useEffect(() => {
    (async () => {
      await fetch("/api/socket");

      socket.current = io();

      socket.current.on("newIncomingMessage", (msg) => {
        console.log("[id].tsx: msg", msg);
      });
    })();
  }, []);

  const onClick = () => {
    if (!socket.current) return;

    socket.current.emit("createdMessage", "Hello from client");
  };

  return (
    <div className="container">
      <Head>
        <title>Mahjong - Game</title>
      </Head>

      <main>
        <h1>Mahjong</h1>
        <p>This is the game {router.query.id}</p>
        <div onClick={onClick} style={{ cursor: "pointer" }}>
          Click
        </div>
      </main>
    </div>
  );
};

export default Game;
