import React, { useState } from "react";
import { GameSummary } from "../lib/types";

type Props = {
  game: GameSummary;
  onGameUpdate: (game: GameSummary) => void;
};

const GameSummary = ({ game, onGameUpdate }: Props) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [nameValue, setNameValue] = useState(game.name);

  const onSaveGame = async () => {
    if (!nameValue) return;

    setIsSaving(true);
    try {
      await fetch("/api/game/name", {
        method: "POST",
        body: JSON.stringify({
          gameId: game.id,
          name: nameValue,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } finally {
      setIsSaving(false);
    }
    setIsEditingName(false);
    onGameUpdate({
      ...game,
      name: nameValue,
    });
  };

  return (
    <li>
      <span>Id: {game.id}</span>
      <ul>
        <li>
          Name:{" "}
          {isEditingName ? (
            <input
              type="text"
              value={nameValue}
              disabled={isSaving}
              onChange={(e) => {
                setNameValue(e.target.value);
              }}
              onKeyUp={(keyObj) => {
                if (keyObj.key?.toLowerCase() === "enter") {
                  onSaveGame();
                }
              }}
            />
          ) : (
            <span>{game.name}</span>
          )}
          {" | "}
          {isEditingName ? (
            <>
              <span style={{ cursor: "pointer" }} onClick={onSaveGame}>
                Save
              </span>{" "}
              <span
                style={{ cursor: "pointer" }}
                onClick={() => {
                  if (isSaving) return;
                  setIsEditingName(false);
                }}
              >
                Cancel
              </span>
            </>
          ) : (
            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (isSaving) return;
                setIsEditingName(true);
              }}
            >
              Edit
            </span>
          )}
        </li>
        {game.players
          .slice()
          .sort((pA, pB) => pA.name.localeCompare(pB.name))
          .map((player) => {
            return (
              <li key={player.id}>
                <a href={`/player/${player.id}`}>
                  {player.name}: {player.id}
                </a>
              </li>
            );
          })}
        <li>
          <a href={`/game/${game.id}/admin`}>Admin view</a>
        </li>
      </ul>
    </li>
  );
};

export default GameSummary;
