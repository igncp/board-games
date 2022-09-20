import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import {
  SMGameStartedAdminPayload,
  SMNewAdminPayload,
  SMPlayersNumPayload,
  SocketMessage,
} from "../../../lib/socketMessages";
import { Game, Tile } from "mahjong/dist/src/core";
import {
  discardTileToBoard,
  getPossibleMeldsInGame,
} from "mahjong/dist/src/game";
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
                  const handlePossibleMelds = (
                    game: Game,
                    discardedTile: Tile["id"] | null
                  ) => {
                    const gameMelds = getPossibleMeldsInGame(game);
                    gameMelds.forEach((gameMeld) => {
                      melds.push({
                        ...gameMeld,
                        tiles: gameMeld.tiles.map((tile) => game.deck[tile]),
                        discardedTile,
                      });
                    });
                  };

                  const playerIndex = playData.players.findIndex(
                    (player) => playData.table.hands[player.id].length === 14
                  );

                  if (
                    playerIndex !== -1 &&
                    playData.round.playerIndex === playerIndex
                  ) {
                    const playerHand = playData.table.hands[
                      playData.players[playerIndex].id
                    ].filter((h) => !h.setId);

                    playerHand.forEach((handTile) => {
                      const gameCopy = JSON.parse(JSON.stringify(playData));
                      const tile = gameCopy.deck[handTile.id];

                      discardTileToBoard({
                        board: gameCopy.table.board,
                        hands: gameCopy.table.hands,
                        playerId: gameCopy.players[playerIndex].id,
                        tileId: handTile.id,
                        round: gameCopy.round,
                      });

                      handlePossibleMelds(gameCopy, tile.id);
                    });
                  }

                  return (
                    <div>
                      {melds.map((meld, index) => (
                        <Fragment key={index}>
                          <div>
                            {
                              playData.players.find(
                                (p) => p.id === meld.playerId
                              ).name
                            }{" "}
                            {meld.discardedTile && (
                              <span>
                                When discarding the tile:{" "}
                                {(() => {
                                  const src = getTileImage(
                                    playData.deck[meld.discardedTile]
                                  );
                                  return (
                                    <img style={{ maxHeight: 80 }} src={src} />
                                  );
                                })()}
                              </span>
                            )}
                          </div>
                          <div>
                            {meld.tiles.map((t) => {
                              const src = getTileImage(t);
                              return (
                                <img
                                  key={t.id}
                                  style={{ maxHeight: 80 }}
                                  src={src}
                                />
                              );
                            })}
                          </div>
                        </Fragment>
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
