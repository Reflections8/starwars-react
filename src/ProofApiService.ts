import {
  Account,
  ConnectAdditionalRequest,
  TonProofItemReplySuccess,
} from "@tonconnect/ui-react";

class ProofService {
  private localStorageKey = "auth_jwt";
  public authorized = false;
  public accessToken: string | null = null;
  public readonly refreshIntervalMs = 9 * 60 * 1000;

  constructor() {
    this.accessToken = localStorage.getItem(this.localStorageKey);
    this.authorized = this.accessToken != null;
    if (!this.accessToken) {
      this.generatePayload();
    }
  }

  async generatePayload(): Promise<ConnectAdditionalRequest | null> {
    return new Promise<ConnectAdditionalRequest | null>((resolve, reject) => {
      try {
        const ws = new WebSocket("wss://socket.purpleguy.dev");

        const pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send("ping");
            console.log("Sent ping");
          }
        }, 5000);

        ws.onopen = () => {
          ws.send("generate_payload");
        };

        ws.onmessage = (event) => {
          const data = event.data.toString();
          if (data.startsWith("payload:")) {
            const payload = data.slice("payload:".length);
            clearInterval(pingInterval);
            ws.close();
            resolve({ tonProof: payload as string });
          }
        };

        ws.onerror = () => {
          clearInterval(pingInterval);
          ws.close();
          reject(null);
        };

        ws.onclose = () => {
          clearInterval(pingInterval);
          if (ws.readyState !== WebSocket.CLOSED) {
            reject(null);
          }
        };
      } catch {
        reject(null);
      }
    });
  }

  async checkProof(
    proof: TonProofItemReplySuccess["proof"],
    account: Account
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        const reqBody = {
          address: account.address,
          network: account.chain,
          public_key: account.publicKey,
          proof: {
            ...proof,
            state_init: account.walletStateInit,
          },
        };

        const ws = new WebSocket("wss://socket.purpleguy.dev");
        const pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send("ping");
          }
        }, 5000);

        ws.onopen = () => {
          ws.send("check_proof:" + JSON.stringify(reqBody));
        };

        ws.onmessage = (event) => {
          const data = event.data.toString();
          if (data.startsWith("token:")) {
            const token = data.slice("token:".length);
            clearInterval(pingInterval);
            ws.close();
            localStorage.setItem(this.localStorageKey, token);
            this.accessToken = token;
            resolve(true);
            this.authorized = true;
          } else if (data.startsWith("error:")) {
            clearInterval(pingInterval);
            ws.close();
            reject(false);
            this.authorized = false;
          }
        };

        ws.onerror = () => {
          clearInterval(pingInterval);
          ws.close();
          reject(false);
          this.authorized = false;
        };

        ws.onclose = () => {
          clearInterval(pingInterval);
        };
      } catch (e) {
        console.log("checkProof error:", e);
        reject(false);
        this.authorized = false;
      }
    });
  }

  reset() {
    this.accessToken = null;
    localStorage.removeItem(this.localStorageKey);
    this.generatePayload();
    this.authorized = false;
  }
}

export const ProofApiService = new ProofService();
