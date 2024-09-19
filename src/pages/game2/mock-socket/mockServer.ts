import { Server } from "mock-socket";

const createMockServer = () => {
  const mockServer = new Server("ws://localhost:8080");

  const gameState = {
    turn: "",
    players: { I: "", II: "" },
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

  const restart = () => {
    gameState.turn = "";
    gameState.players = { I: "", II: "" };
    gameState.boards = {
      I: {
        misses: [],
        ships: [],
      },
      II: {
        misses: [],
        ships: [],
      },
    };
  };
  mockServer.on("connection", (socket) => {
    socket.on("message", (data) => {
      // @ts-ignore
      const { message, source, type }: any = JSON.parse(data);
      switch (type) {
        case "giveUp":
          socket.send(
            JSON.stringify({
              type: "gameOver",
              message: { victory: false },
            })
          );
          restart();
          break;
        case "timeOut":
          gameState.turn = gameState.players[getEnemy(source)];
          socket.send(
            JSON.stringify({
              type: "turn",
              message: { player: gameState.turn },
            })
          );
          break;
        case "shipsInit":
          if (!gameState.players.I) gameState.players.I = source;
          else gameState.players.II = source;

          gameState.boards[getMe(source)].misses = [];
          gameState.boards[getMe(source)].ships = message.map(
            (shipPos: any) => {
              return {
                length: shipPos.ship.length,
                vertical: shipPos.ship.vertical,
                head: { row: shipPos.pos.row, column: shipPos.pos.column },
                cells: [],
              };
            }
          );
          ///SET MOCK ENEMY BOARD
          gameState.boards.II = JSON.parse(JSON.stringify(gameState.boards.I));
          gameState.players.II = "mock";
          ///
          if (gameState.players.I && gameState.players.II) {
            gameState.turn =
              gameState.players[Math.random() > 0.5 ? "I" : "II"];
            socket.send(
              JSON.stringify({
                type: "turn",
                message: { player: gameState.turn },
              })
            );
          }
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
          if (gameState.turn !== source) return;

          let isHit = false;
          let isDead = false;
          const { ships, misses } = gameState.boards[getEnemy(source)];

          ships.forEach((s, idx) => {
            if (isHit) return;
            const { length, vertical, head } = s;
            const { row: r, column: c } = message;
            const { row, column } = head;

            if (vertical) {
              if (r >= row && r < row + length && c === column) isHit = true;
            } else {
              if (c >= column && c < column + length && r === row) isHit = true;
            }

            if (isHit) {
              // @ts-ignore
              ships[idx].cells.push({
                row: r,
                column: c,
              });
              // @ts-ignore
              if (ships[idx].cells.length === length) {
                // @ts-ignore
                ships[idx].isDead = true;
                isDead = true;
              } else {
                isDead = false;
              }
            }
          });
          // @ts-ignore
          if (!isHit) misses.push(message);
          //to source of fire player send fireResult, to enemy recieveFire
          //@ts-ignore
          if (ships.filter((s) => s.isDead).length === 10) {
            if (source === "mock") {
              restart();
              socket.send(
                JSON.stringify({
                  type: "gameOver",
                  message: { victory: false },
                })
              );
            } else {
              restart();
              socket.send(
                JSON.stringify({
                  type: "gameOver",
                  message: { victory: true },
                })
              );
            }
            return;
          }
          //
          if (source === "mock") {
            socket.send(
              JSON.stringify({
                type: "recieveFire",
                isMe: true,
                message: gameState.boards[getEnemy(source)],
                attack: message,
                isHit,
                isDead,
              })
            );
          } else {
            socket.send(
              JSON.stringify({
                type: "fireResult",
                message: hideInfo(gameState.boards[getEnemy(source)]),
                isHit,
                isDead,
              })
            );
          }
          if (isHit) gameState.turn = source;
          else gameState.turn = gameState.players[getEnemy(source)];
          //send to both players
          socket.send(
            JSON.stringify({
              type: "turn",
              message: { player: gameState.turn },
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
