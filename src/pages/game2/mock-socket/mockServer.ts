import { Server } from "mock-socket";

const createMockServer = () => {
  const mockServer = new Server("ws://localhost:8080");

  // Инициализация состояния игры
  const gameState = {
    players: {},
    currentPlayer: null,
    board: {},
    moves: [],
  };

  const getNextPlayer = (currentPlayer) => {
    return currentPlayer === "player1" ? "player2" : "player1";
  };

  mockServer.on("connection", (socket) => {
    socket.on("message", (data) => {
      const message = JSON.parse(data);

      switch (message.type) {
        case "join":
          break;
        case "move":
          break;
        case "fire":
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
