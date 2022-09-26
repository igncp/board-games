import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import io from "socket.io-client";
import {
  SMGameStartedPayload,
  SocketMessage,
} from "../../../lib/socketMessages";
import Tile from "../../../components/tile";
import { useUserId } from "../../../components/hooks/useUserId";
import TilesList from "../../../components/tiles-list";
import {
  useGameControls,
  selectTileKeys,
} from "../../../components/hooks/useGameControls";

// Temp workaround to handle HMR
let connected = false;

const Game = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [playData, setPlayData] = useState<SMGameStartedPayload | null>(null);

  const socket = useRef(null);
  const gameId = router.query.id as string;

  const {
    propsRef,
    getPlayerIndex,
    getIsCurrentRoundPlayer,
    selectedHandTiles,
  } = useGameControls({
    gameId,
    playData,
    socket: socket.current,
    userId,
  });

  useUserId(setUserId);

  useEffect(() => {
    if (!gameId || !userId || connected) return;

    (async () => {
      connected = true;
      await fetch("/api/socket");

      socket.current = io({
        query: { gameId, userId },
        reconnection: true,
        reconnectionDelay: 500,
        reconnectionAttempts: 10,
      });

      socket.current.on(
        SocketMessage.GameStarted,
        (data: SMGameStartedPayload) => {
          console.log("[id].tsx: data", data);
          setPlayData(data);
        }
      );
    })();
  }, [gameId]);

  return (
    <div className="container">
      <Head>
        <title>Mahjong - Game</title>
      </Head>
      <main>
        <h1>
          Mahjong - <a href="/">Home</a>
        </h1>
        {!playData && <div>Waiting for other players...</div>}
        {playData &&
          playData.game.hand &&
          (() => {
            const playerIndex = getPlayerIndex();
            const isCurrentRoundPlayer = getIsCurrentRoundPlayer();

            const getPlayerTableName = (offset) => {
              const index = (playerIndex + offset) % 4;
              const name = offset === 0 ? "You" : playData.players[index].name;

              return [
                index === playData.game.round.playerIndex ? "*" : "",
                name,
              ]
                .filter(Boolean)
                .join(" ");
            };

            const setIdsSet = playData.game.hand.reduce((set, tile) => {
              if (tile.setId) set.add(tile.setId);
              return set;
            }, new Set<string>());
            const setIds = Array.from(setIdsSet);

            const discardProps = propsRef.current.getDiscardProps();
            const drawProps = propsRef.current.getDrawProps();
            const nextTurnProps = propsRef.current.getNextTurnProps();
            const claimTileProps = propsRef.current.getClaimTileProps();
            const createMeldProps = propsRef.current.getCreateMeldProps();
            const sayMahjongProps = propsRef.current.getSayMahjongProps();
            const sortHandProps = propsRef.current.getSortHandProps();

            return (
              <div>
                <p>Score:</p>
                <ul>
                  {playData.players.map((p) => (
                    <li key={p.id}>
                      {p.name}: {playData.game.score[p.id]}
                    </li>
                  ))}
                </ul>
                {isCurrentRoundPlayer && (
                  <p>
                    <b>It is your turn</b>
                  </p>
                )}
                <div>
                  <table style={{ textAlign: "center" }}>
                    <tbody>
                      <tr>
                        <td></td>
                        <td>{getPlayerTableName(2)}</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>{getPlayerTableName(3)}</td>
                        <td></td>
                        <td>{getPlayerTableName(1)}</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>{getPlayerTableName(0)}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <p>The board:</p>
                  <TilesList tiles={playData.game.board} deck={playData.deck} />
                </div>
                <div>
                  <button
                    onClick={drawProps.onClick}
                    disabled={drawProps.disabled}
                  >
                    Draw (d)
                  </button>
                  <button
                    disabled={discardProps.disabled}
                    onClick={discardProps.onClick}
                  >
                    Discard (d)
                  </button>
                  <button
                    onClick={sortHandProps.onClick}
                    disabled={sortHandProps.disabled}
                  >
                    Sort hand (s)
                  </button>
                  {isCurrentRoundPlayer && (
                    <button
                      disabled={nextTurnProps.disabled}
                      onClick={nextTurnProps.onClick}
                    >
                      Move turn (t)
                    </button>
                  )}
                  <button
                    onClick={claimTileProps.onClick}
                    disabled={claimTileProps.disabled}
                  >
                    Claim last tile (c)
                  </button>
                  <button
                    disabled={createMeldProps.disabled}
                    onClick={createMeldProps.onClick}
                  >
                    Create meld (m)
                  </button>
                  <button
                    disabled={sayMahjongProps.disabled}
                    onClick={sayMahjongProps.onClick}
                  >
                    Say Mahjong (m)
                  </button>
                </div>
                <div style={{ border: "1px solid black" }}>
                  <p>Your hand: ({playData.game.hand.length})</p>
                  <ul>
                    {playData.game.hand
                      .filter((t) => !t.setId)
                      .map((handTile, handTileIndex) => {
                        const tile = playData.deck[handTile.id];
                        return (
                          <li
                            key={tile.id}
                            style={{
                              display: "inline-flex",
                              position: "relative",
                              width: 80,
                            }}
                            onClick={() => {
                              propsRef.current.onTileClick(tile.id);
                            }}
                          >
                            <span
                              style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                color: "#777",
                              }}
                            >
                              {selectTileKeys[handTileIndex]}
                            </span>
                            <Tile
                              tile={tile}
                              interactive
                              style={{
                                outline:
                                  "5px solid " +
                                  (selectedHandTiles[tile.id]
                                    ? "red"
                                    : "transparent"),
                              }}
                            />
                          </li>
                        );
                      })}
                  </ul>
                  {!!setIds.length && <p>Melds:</p>}
                  {setIds.map((setId) => {
                    const subHand = playData.game.hand.filter(
                      (t) => t.setId === setId
                    );
                    const tileStyle = {
                      display: "inline-flex",
                      width: 60,
                    };
                    return (
                      <ul key={setId}>
                        {subHand.map((handTile) => {
                          const tile = playData.deck[handTile.id];
                          return (
                            <li
                              key={tile.id}
                              style={{
                                ...tileStyle,
                                border:
                                  "5px solid " +
                                  (selectedHandTiles[tile.id]
                                    ? "red"
                                    : "transparent"),
                              }}
                            >
                              <Tile tile={tile} />
                            </li>
                          );
                        })}
                        <li style={tileStyle}>
                          {subHand[0].concealed ? "Concealed" : "Visible"}
                        </li>
                        {subHand[0].concealed && (
                          <button
                            onClick={() => {
                              propsRef.current.onBreakMeld(setId);
                            }}
                          >
                            Remove meld
                          </button>
                        )}
                      </ul>
                    );
                  })}
                </div>
              </div>
            );
          })()}
      </main>
    </div>
  );
};

export default Game;
