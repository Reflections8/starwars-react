import React, { useCallback, useEffect, useRef } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { ProofApiService } from "../../ProofApiService.ts";
import useInterval from "../../hooks/useInterval.ts";

interface ProofManagerComponentProps {
  onValueChange: (newValue: string | null) => void;
}

export const ProofManager: React.FC<ProofManagerComponentProps> = ({ onValueChange }) => {
  const firstProofLoading = useRef<boolean>(true);
  const [tonConnectUI] = useTonConnectUI();

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
          if (
            await ProofApiService.checkProof(
              w.connectItems.tonProof.proof,
              w.account
            )
          ) {
            onValueChange(ProofApiService.accessToken);
            console.log("authorized");
          } else {
            tonConnectUI.disconnect();
            ProofApiService.authorized = false;
            console.log("not authorized no access token");
            return;
          }
        }

        onValueChange(ProofApiService.accessToken);
        ProofApiService.authorized = true;
      }),
    [tonConnectUI]
  );

  return <></>;
}
