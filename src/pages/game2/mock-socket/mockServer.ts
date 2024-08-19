import { Server } from "mock-socket";

const createMockServer = () => {
  const mockServer = new Server("ws://localhost:8080");

  const gameState = {
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

  mockServer.on("connection", (socket) => {
    socket.on("message", (data) => {
      const { message, source, type }: any = JSON.parse(data);
      switch (type) {
        case "giveUp":
          socket.send(
            JSON.stringify({
              type: "gameOver",
              message: { victory: false },
            })
          );
          break;
        case "timeOut":
          socket.send(
            JSON.stringify({
              type: "turn",
              message: { player: gameState.players[getEnemy(source)] },
            })
          );
          break;
        case "shipsInit":
          if (!gameState.players.I) gameState.players.I = source;
          else gameState.players.II = source;

          gameState.boards[getMe(source)].misses = [];
          gameState.boards[getMe(source)].ships = message.map(
            (shipPos: any) => {
              console.log(shipPos);
              return {
                length: shipPos.ship.length,
                vertical: shipPos.ship.vertical,
                head: { row: shipPos.pos.row, column: shipPos.pos.column },
                cells: [],
              };
            }
          );
          console.log(gameState.boards[getMe(source)]);
          ///SET MOCK ENEMY BOARD
          gameState.boards.II = JSON.parse(JSON.stringify(gameState.boards.I));
          gameState.players.II = "mock";
          ///
          if (gameState.players.I && gameState.players.II) {
            const turn = Math.random() > 0.5 ? "I" : "II";
            socket.send(
              JSON.stringify({
                type: "turn",
                message: { player: gameState.players[turn] },
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
          let isHit = false;
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
              if (ships[idx].cells.length === length) ships[idx].isDead = true;
            }
          });
          // @ts-ignore
          if (!isHit) misses.push(message);
          //to source of fire player send fireResult, to enemy recieveFire
          //@ts-ignore
          if (ships.filter((s) => s.isDead).length === 10) {
            if (source === "mock") {
              socket.send(
                JSON.stringify({
                  type: "gameOver",
                  message: { victory: false },
                })
              );
            } else {
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
              })
            );
          } else {
            socket.send(
              JSON.stringify({
                type: "fireResult",
                message: hideInfo(gameState.boards[getEnemy(source)]),
              })
            );
          }
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
