import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { SERVER_URL } from "./main.tsx";
import { ProofApiService } from "./ProofApiService.ts";
import { useDrawer } from "./context/DrawerContext.tsx";

interface UserDataContextType {
  credits: number;
  tokens: number;
  tons: number;
  jwt: string | null;
  exchangeRate: number;
  updateCredits: (value: number) => void;
  updateTokens: (value: number) => void;
  updateJwt: (value: string | null) => void;
  startCheckBalance: () => void;
}

const defaultValue: UserDataContextType = {
  credits: 0,
  tokens: 0,
  tons: 0,
  exchangeRate: 0,
  jwt: localStorage.getItem(ProofApiService.localStorageKey),
  updateCredits: () => {},
  updateTokens: () => {},
  updateJwt: () => {},
  startCheckBalance: () => {},
};

const UserDataContext = createContext<UserDataContextType>(defaultValue);

interface UserDataProviderProps {
  children: ReactNode;
}

export const UserDataProvider: React.FC<UserDataProviderProps> = ({
  children,
}) => {
  const [jwt, setJwt] = useState<string | null>("");
  const [credits, setCredits] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [tons, setTons] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const { openDrawer } = useDrawer();
  const [checkBalance, setCheckBalance] = useState(false);

  const tonsRef = useRef<number>(tons);

  const updateCredits = (newCredits: number) => {
    setCredits(newCredits);
  };

  const updateTokens = (newCredits: number) => {
    setTokens(newCredits);
  };

  const updateJwt = (value: string | null) => {
    setJwt(value);
  };

  const startCheckBalance = () => {
    setCheckBalance(true);
  };

  useEffect(() => {
    if (tonsRef.current < tons && checkBalance) {
      openDrawer!("resolved", "bottom", "Успешное пополнение баланса");
    }
    tonsRef.current = tons;
  }, [tons, checkBalance]);

  useEffect(() => {
    if (jwt != null) {
      const ws = new WebSocket(SERVER_URL); // Замените на ваш URL вебсокета

      ws.onmessage = (event) => {
        if (event.data.toString().startsWith("financeData:")) {
          const data = JSON.parse(event.data.slice("financeData:".length));
          setCredits(data.credits);
          setTons(data.tons);
          setTokens(data.tokens);
          setExchangeRate(data.exchange_rate);
        }
      };

      ws.onopen = () => {
        if (jwt != null) ws.send("getFinanceData:" + jwt);
      };

      const interval = setInterval(() => {
        if (jwt != null) ws.send("getFinanceData:" + jwt);
      }, 10000);

      return () => {
        clearInterval(interval);
        ws.close();
      };
    }
  }, [jwt]);

  return (
    <UserDataContext.Provider
      value={{
        credits,
        tokens,
        tons,
        jwt,
        exchangeRate,
        updateCredits,
        updateTokens,
        updateJwt,
        startCheckBalance,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);
