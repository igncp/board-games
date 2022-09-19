import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import {
  SMGameStartedAdminPayload,
  SMNewAdminPayload,
  SMPlayersNumPayload,
  SocketMessage,
} from "../../../lib/socketMessages";
import {
  getBoardTilePlayerDiff,
  getPossibleMelds,
} from "mahjong/dist/src/melds";
import { Round } from "mahjong/dist/src/core";
import { getTileImage } from "../../../lib/images";

// Temp workaround to handle HMR
let connected = false;

const GameAdmin = () => {
  const router = useRouter();
  const socket = useRef(null);
  const gameId = router.query.id as string;

  const [playersNum, setPlayersNum] = useState<number | null>(null);
  const [playData, setPlayData] = useState<SMGameStartedAdminPayload | null>(
    null
  );

  useEffect(() => {
    if (!gameId || connected) return;

    (async () => {
      connected = true;
      await fetch("/api/socket");

      socket.current = io();

      socket.current.on(
        SocketMessage.PlayersNum,
        ({ num }: SMPlayersNumPayload) => {
          setPlayersNum(num);
        }
      );

      socket.current.on(
        SocketMessage.GameStartedAdmin,
        (data: SMGameStartedAdminPayload) => {
          console.log("[id].tsx: data", data);
          setPlayData(data);
        }
      );

      const payload: SMNewAdminPayload = { gameId };
      socket.current.emit(SocketMessage.NewAdmin, payload);
    })();
  }, [gameId]);

  return (
    <div>
      <div>This is the admin view</div>
      {playData && (
        <>
          <div>Players num: {playersNum}</div>
          <div>Player index: {playData.round.playerIndex}</div>
          <div style={{ border: "1px solid black" }}>
            <div>Possible melds:</div>
            <div>
              <div>
                {(() => {
                  const melds = [];
                  playData.players.forEach((player) => {
                    const {
                      deck,
                      round,
                      table: { hands },
                    } = playData;
                    const { tileClaimed } = round;
                    const canClaimTile =
                      tileClaimed &&
                      tileClaimed.by === null &&
                      tileClaimed.from !== player.id;
                    const hand = hands[player.id].concat(
                      canClaimTile
                        ? [
                            {
                              concealed: true,
                              id: tileClaimed.id,
                              setId: null,
                            },
                          ]
                        : []
                    );

                    const boardTilePlayerDiff = getBoardTilePlayerDiff({
                      hand,
                      playerId: player.id,
                      players: playData.players,
                      round: canClaimTile
                        ? ({
                            ...round,
                            tileClaimed: {
                              ...round.tileClaimed,
                              by: player.id,
                            },
                          } as Round)
                        : round,
                    });

                    const possibleMelds = getPossibleMelds({
                      boardTilePlayerDiff,
                      deck,
                      hand,
                      round,
                    });

                    if (possibleMelds.length) {
                      possibleMelds.forEach((meld) => {
                        melds.push({
                          playerId: player.id,
                          tiles: meld.map((tileId) => deck[tileId]),
                        });
                      });
                    }
                  });
                  return (
                    <div>
                      {melds.map((meld, index) => (
                        <>
                          <div>
                            {
                              playData.players.find(
                                (p) => p.id === meld.playerId
                              ).name
                            }
                          </div>
                          <div key={index}>
                            {meld.tiles.map((t) => {
                              const src = getTileImage(t);
                              return (
                                <img style={{ maxHeight: 80 }} src={src} />
                              );
                            })}
                          </div>
                        </>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GameAdmin;
