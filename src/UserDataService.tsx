import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { SERVER_URL } from "./main.tsx";
import { ProofApiService } from "./ProofApiService.ts";
import { useDrawer } from "./context/DrawerContext.tsx";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Drawer } from "./ui/Drawer/Drawer.tsx";

interface UserDataContextType {
  credits: number;
  tokens: number;
  tons: number;
  jwt: string | null;
  exchangeRate: number;
  blasters: Blaster[];
  activeBlaster: Blaster | null;
  prices: Prices;
  selectGun: (value: number) => void;
  updateCredits: (value: number) => void;
  updateTokens: (value: number) => void;
  updateJwt: (value: string | null) => void;
  startCheckBalance: () => void;
  sendSocketMessage: (value: string) => void;
}

const defaultValue: UserDataContextType = {
  credits: 0,
  tokens: 0,
  tons: 0,
  exchangeRate: 0,
  jwt: "",
  blasters: [],
  activeBlaster: null,
  prices: {
    second_blaster_repair: 0,
    third_blaster_repair: 0,
    blaster_1_1: 0,
    blaster_1_2: 0,
    blaster_1_3: 0,
    blaster_2_1: 0,
    blaster_2_2: 0,
    blaster_2_3: 0,
    blaster_3_1: 0,
    blaster_3_2: 0,
    blaster_3_3: 0,
  },
  selectGun: () => {},
  updateCredits: () => {},
  updateTokens: () => {},
  updateJwt: () => {},
  startCheckBalance: () => {},
  sendSocketMessage: () => {},
};

const UserDataContext = createContext<UserDataContextType>(defaultValue);

interface UserDataProviderProps {
  children: ReactNode;
}

export function UserDataProvider({ children }: UserDataProviderProps) {
  const { openDrawer, isOpen, drawerText } = useDrawer();

  const [jwt, setJwt] = useState<string | null>("");

  const [credits, setCredits] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [tons, setTons] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);

  const [activeBlaster, setActiveBlaster] = useState<Blaster | null>(null);
  const [blasters, setBlasters] = useState<Blaster[]>([]);
  const [prices, setPrices] = useState<Prices>({
    second_blaster_repair: 0,
    third_blaster_repair: 0,
    blaster_1_1: 0,
    blaster_1_2: 0,
    blaster_1_3: 0,
    blaster_2_1: 0,
    blaster_2_2: 0,
    blaster_2_3: 0,
    blaster_3_1: 0,
    blaster_3_2: 0,
    blaster_3_3: 0,
  });

  const [checkBalance, setCheckBalance] = useState(false);
  const [shouldReconnectFlag, setShouldReconnectFlag] = useState(true);

  const tonsRef = useRef<number>(tons);

  const { sendMessage, lastMessage, readyState } = useWebSocket(SERVER_URL, {
    share: false,
    shouldReconnect: () => shouldReconnectFlag,
    onClose: (event) => {
      if (event.code == 249) {
        setShouldReconnectFlag(false);
      }
    },
  });

  const updateCredits = (newCredits: number) => {
    setCredits(newCredits);
  };

  const updateTokens = (newCredits: number) => {
    setTokens(newCredits);
  };

  const selectGun = (level: number) => {
    const blaster = blasters.find((item) => item.level === level);
    if (blaster) setActiveBlaster(blaster);
  };

  const updateJwt = (value: string | null) => {
    setJwt(value);
    if (value != null)
      localStorage.setItem(ProofApiService.localStorageKey, value);
    else localStorage.removeItem(ProofApiService.localStorageKey);
  };

  const startCheckBalance = () => {
    setCheckBalance(true);
  };

  const sendSocketMessage = (value: string) => {
    sendMessage(value);
  };

  useEffect(() => {
    if (tonsRef.current < tons && checkBalance) {
      openDrawer!("resolved", "bottom", "Успешное пополнение баланса");
    }
    tonsRef.current = tons;
  }, [tons, checkBalance]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      if (jwt != null && jwt !== "") {
        sendMessage("handshake:" + jwt);

        sendMessage("getFinanceData:" + jwt);
        sendMessage("blasters:" + jwt);
        const interval = setInterval(() => {
          if (jwt != null && jwt !== "") {
            sendMessage("getFinanceData:" + jwt);
            sendMessage("blasters:" + jwt);
          }
        }, 10000);

        return () => {
          clearInterval(interval);
        };
      }
    }
  }, [readyState, jwt]);

  useEffect(() => {
    if (lastMessage == null) return;

    const response: string = lastMessage.data.toString();

    if (response.startsWith("financeData:")) {
      const data = JSON.parse(response.slice("financeData:".length));
      setCredits(data.credits);
      setTons(data.tons);
      setTokens(data.tokens);
      setExchangeRate(data.exchange_rate);
    } else if (response.startsWith("exchangeResponse:")) {
      const data = JSON.parse(response.slice("exchangeResponse:".length));
      setCredits(data.credits);
      setTons(data.tons);
      setTokens(data.tokens);
      setExchangeRate(data.exchange_rate);
      openDrawer!("resolved", "bottom", "Обмен успешно произведён");
    } else if (response.startsWith("blastersResponse:")) {
      const blastersResult = JSON.parse(
        response.slice("blastersResponse:".length)
      );

      const blasters: Blaster[] = blastersResult.blasters;
      const pricesResponse: Prices = blastersResult.prices;

      setPrices(pricesResponse);
      setBlasters(blasters);
    } else if (response.startsWith("blasterBuyResponse:")) {
      openDrawer!(
        "resolved",
        "bottom",
        "Покупка бластера выполнена.\nNFT отправлена на подключенный кошелек. Скорость подтверждения зависит от загруженности сети TON."
      );
      const blasters: Blaster[] = JSON.parse(
        response.slice("blasterBuyResponse:".length)
      );
      setBlasters(blasters);
    } else if (response.startsWith("blasterUpgradeResponse:")) {
      openDrawer!(
        "resolved",
        "bottom",
        "Улучшение бластера выполнено успешно."
      );
      const blasters: Blaster[] = JSON.parse(
        response.slice("blasterUpgradeResponse:".length)
      );
      setBlasters(blasters);
    } else if (response.startsWith("withdrawResponse:")) {
      const data = JSON.parse(response.slice("withdrawResponse:".length));
      setCredits(data.credits);
      setTons(data.tons);
      setTokens(data.tokens);
      setExchangeRate(data.exchange_rate);
      openDrawer!(
        "resolved",
        "bottom",
        "Вывод добавлен в обработку. Скорость подтверждения зависит от загруженности сети TON."
      );
    } else if (response.startsWith("blasterRepairResponse:")) {
      const num = parseInt(response.slice("blasterRepairResponse:".length));

      if (num == 2) prices.second_blaster_repair = 0;
      else if (num == 3) prices.third_blaster_repair = 0;

      const blasterTemp = blasters;
      for (let i = 0; i < blasterTemp.length; i++) {
        if (blasterTemp[i].level == num) {
          blasterTemp[i].usage = blasterTemp[i].max_usage;
        }
      }

      setBlasters(blasterTemp);

      openDrawer!("resolved", "bottom", "Починка бластера успешна выполнена.");
    }  else if (response.startsWith("CODE:")) {
      const exitCode = parseInt(response.slice("CODE:".length));
      switch (exitCode) {
        case 901: {
          openDrawer!("rejected", "bottom", "Ошибка при выполнении обмена");
          break;
        }
        case 1001: {
          openDrawer!("rejected", "bottom", "Недостаточно TON для вывода");
          break;
        }
        case 1002: {
          openDrawer!("rejected", "bottom", "Недостаточно AKRON для вывода");
          break;
        }
        case 1003: {
          openDrawer!(
            "rejected",
            "bottom",
            "Недостаточно TON для оплаты комиссии для вывода AKRON\nНеобходимо минимум: 0.05 TON"
          );
          break;
        }
        case 10001: {
          openDrawer!(
            "rejected",
            "bottom",
            "Недостаточно TON для покупки бластера 2 уровня\nНеобходимо 1 TON + 0.05 TON (gas fee)"
          );
          break;
        }
        case 10002: {
          openDrawer!(
            "rejected",
            "bottom",
            "Недостаточно TON для покупки бластера 3 уровня\nНеобходимо 2 TON + 0.05 TON (gas fee)"
          );
          break;
        }
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    setJwt(localStorage.getItem(ProofApiService.localStorageKey));
  }, []);

  return (
    <UserDataContext.Provider
      value={{
        credits,
        tokens,
        tons,
        jwt,
        activeBlaster,
        exchangeRate,
        blasters,
        prices,
        selectGun,
        updateCredits,
        updateTokens,
        updateJwt,
        startCheckBalance,
        sendSocketMessage,
      }}
    >
      {children}
      <Drawer isOpen={isOpen!} drawerText={drawerText} />
    </UserDataContext.Provider>
  );
}

export const useUserData = () => useContext(UserDataContext);

interface Blaster {
  id: number; // long в C# соответствует number в TypeScript
  owner: string; // string
  level: number; // int
  usage: number; // int
  max_usage: number;
  charge: number; // int
  max_charge: number; // int
  chargeStep: number; // double соответствует number в TypeScript
  damage: number; // uint в C# соответствует number в TypeScript
  damage_level: number; // int
  max_charge_level: number; // double соответствует number в TypeScript
  charge_level: number;
}

export interface Prices {
  second_blaster_repair: number;
  third_blaster_repair: number;
  blaster_1_1: number;
  blaster_1_2: number;
  blaster_1_3: number;
  blaster_2_1: number;
  blaster_2_2: number;
  blaster_2_3: number;
  blaster_3_1: number;
  blaster_3_2: number;
  blaster_3_3: number;
}
