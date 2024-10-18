import React, { useCallback, useEffect, useRef } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { ProofApiService } from "../../ProofApiService.ts";
import useInterval from "../../hooks/useInterval.ts";
import { useUserData } from "../../UserDataService.tsx";

interface ProofManagerComponentProps {
  onValueChange: (newValue: string | null) => void;
}

export const ProofManager: React.FC<ProofManagerComponentProps> = () => {
  const firstProofLoading = useRef<boolean>(true);
  const [tonConnectUI] = useTonConnectUI();
  const { updateJwt } = useUserData();

  const recreateProofPayload = useCallback(async () => {
    if (firstProofLoading.current) {
      tonConnectUI.setConnectRequestParameters({ state: "loading" });
      firstProofLoading.current = false;
    }

    const payload = await ProofApiService.generatePayload();

    if (payload) {
      tonConnectUI.setConnectRequestParameters({
        state: "ready",
        value: payload,
      });
    } else {
      tonConnectUI.setConnectRequestParameters(null);
    }
  }, [tonConnectUI, firstProofLoading]);

  if (firstProofLoading.current) {
    recreateProofPayload();
  }

  useInterval(recreateProofPayload, ProofApiService.refreshIntervalMs);

  useEffect(
    () =>
      tonConnectUI.onStatusChange(async (w) => {
        if (!w) {
          ProofApiService.reset();
          console.log("not authorized");
          return;
        }

        if (w.connectItems?.tonProof && "proof" in w.connectItems.tonProof) {
          const token: string | null = await ProofApiService.checkProof(
            w.connectItems.tonProof.proof,
            w.account
          );
          if (token) {
            updateJwt(token);
            console.log("authorized");
          } else {
            updateJwt(null);
            ProofApiService.reset();
            tonConnectUI.disconnect();
            console.log("not authorized no access token");
            return;
          }
        }
      }),
    [tonConnectUI, updateJwt]
  );

  return <></>;
};
