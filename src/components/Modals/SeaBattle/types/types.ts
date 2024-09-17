export type Room = {
  room_name: string;
  creator: {
    Wallet: string;
    WebSocket: {
      CloseStatus: number;
      CloseStatusDescription: string;
      State: number;
      SubProtocol: null;
    };
    MissedTurns: number;
  };
  player: string;
  bet_type: number;
  bet_amount: number;
};
