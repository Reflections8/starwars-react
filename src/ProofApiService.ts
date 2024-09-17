import {
  Account,
  ConnectAdditionalRequest,
  TonProofItemReplySuccess,
} from "@tonconnect/ui-react";
import { SERVER_URL } from "./main.tsx";

class ProofService {
  public readonly localStorageKey = "auth_jwt";
  public authorized = false;
  public accessToken: string | null = null;
  public readonly refreshIntervalMs = 9 * 60 * 1000;

  async generatePayload(): Promise<ConnectAdditionalRequest | null> {
    try {
      const response = await fetch(SERVER_URL + "/auth/generatePayload", {
        method: "GET",
        headers: {
          Accept: "text/plain",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jsonResponse = await response.json();
      return { tonProof: jsonResponse.payload };
    } catch (error) {
      console.error("Failed to fetch data:", error);
      return null;
    }
  }

  async checkProof(
    proof: TonProofItemReplySuccess["proof"],
    account: Account
  ): Promise<string | null> {
    try {
      const reqBody = {
        address: account.address,
        network: account.chain,
        public_key: account.publicKey,
        proof: {
          payload: proof.payload,
          timestamp: proof.timestamp,
          domain: {
            value: proof.domain.value,
            length_bytes: proof.domain.lengthBytes,
          },
          signature: proof.signature,
          state_init: account.walletStateInit,
        },
      };

      const response = await fetch(SERVER_URL + "/auth/checkProof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const jsonResponse = await response.json();
      if (jsonResponse.code === 1 && jsonResponse.jwt) {
        localStorage.setItem(this.localStorageKey, jsonResponse.jwt);
        this.accessToken = jsonResponse.jwt;
        this.authorized = true;
        return jsonResponse.jwt;
      } else {
        this.authorized = false;
        throw new Error(
          "Authorization failed with server error code: " + jsonResponse.code
        );
      }
    } catch (error) {
      console.error("Failed to check proof:", error);
      this.authorized = false;
      return null;
    }
  }

  reset() {
    this.accessToken = null;
    //  localStorage.removeItem(this.localStorageKey);
    this.generatePayload();
    this.authorized = false;
  }
}

export const ProofApiService = new ProofService();
