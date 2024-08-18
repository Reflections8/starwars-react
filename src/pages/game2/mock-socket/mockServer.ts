import { Server } from "mock-socket";
import { version } from "react";

const createMockServer = () => {
  const mockServer = new Server("ws://localhost:8080");

  // Инициализация состояния игры
  const gameState = {
    players: { I: "", II: "" },
    currentPlayer: null,
    boards: {
      I: {
        misses: [],
        ships: [],
      },
      II: {
        misses: [],
        ships: [],
      },
    },
  };

  const getNextPlayer = (currentPlayer: string) => {
    return currentPlayer === "player1" ? "player2" : "player1";
  };
  const getMe = (source: string): "I" | "II" =>
    gameState.players.I === source ? "I" : "II";
  const getEnemy = (source: string): "I" | "II" =>
    gameState.players.I !== source ? "I" : "II";

  const hideInfo = (board: any) => {
    return {
      isMe: false,
      misses: board.misses,
      ships: board.ships.map((ship: any) => ({
        isDead: ship.isDead,
        cells: ship.cells,
      })),
    };
  };

  mockServer.on("connection", (socket) => {
    socket.on("message", (data) => {
      const { message, source, type }: any = JSON.parse(data);
      switch (type) {
        case "shipsInit":
          //decide which board this source uses
          if (!gameState.players.I) {
            gameState.players.I = source;
          } else {
            gameState.players.II = source;
          }
          gameState.boards[getMe(source)].misses = [];
          gameState.boards[getMe(source)].ships = message.map(
            (shipPos: any) => {
              return {
                length: shipPos.ship.length,
                version: shipPos.ship.vertical,
                head: { row: shipPos.pos.row, column: shipPos.pos.column },
                cells: [],
              };
            }
          );
          ///SET MOCK ENEMY BOARD
          gameState.boards.II = gameState.boards.I;
          ///
          socket.send(
            JSON.stringify({
              type: "updateBoard",
              message: {
                isMe: true,
                ...gameState.boards[getMe(source)],
              },
            })
          );
          break;
        case "fire":
          let isHit = false;

          gameState.boards[getEnemy(source)].ships.forEach((s, idx) => {
            if (isHit) return;
            const { length, vertical, head } = s;
            const { row: r, column: c } = message;
            const { row, column } = head;
            if (vertical) {
              if (r >= row && r < row + length && c === column) {
                isHit = true;
              }
            } else {
              if (c >= column && c < column + length && r === row) {
                isHit = true;
              }
            }
            if (isHit) {
              gameState.boards[getEnemy(source)].ships[idx].cells.push({
                row: r,
                column: c,
              });
              if (
                gameState.boards[getEnemy(source)].ships[idx].cells.length ===
                length
              ) {
                gameState.boards[getEnemy(source)].ships[idx].isDead = true;
              }
            }
          });
          if (!isHit) {
            gameState.boards[getEnemy(source)].misses.push(message);
          }
          socket.send(
            JSON.stringify({
              type: "fireResult",
              message: hideInfo(gameState.boards[getEnemy(source)]),
            })
          );
          break;
        case "join":
          break;
        case "move":
          break;

        default:
          socket.send(
            JSON.stringify({ type: "error", message: "Unknown message type" })
          );
      }
    });

    socket.on("close", () => {
      console.log("Client disconnected");
    });
  });

  return mockServer;
};

export default createMockServer;
