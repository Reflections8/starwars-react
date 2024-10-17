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
import { Drawer } from "./ui/Drawer/Drawer.tsx";

import ch1Img from "../src/assets/img/ch/1.png";
import ch2Img from "../src/assets/img/ch/2.png";
import ch3Img from "../src/assets/img/ch/3.png";
import ch4Img from "../src/assets/img/ch/4.png";
import ch0Img from "../src/assets/img/ch/0.png";
import bl1Img from "../src/assets/img/bl/1.png";
import bl2Img from "../src/assets/img/bl/2.png";
import bl3Img from "../src/assets/img/bl/3.png";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useTranslation } from "react-i18next";

interface UserDataContextType {
  userDataDefined: boolean;
  credits: number;
  tokens: number;
  tons: number;
  jwt: string | null;
  checkGun: boolean;
  exchangeRate: number;
  userMetrics: UserMetrics;
  blasters: Blaster[];
  characters: Character[];
  activeBlaster: Blaster | null;
  higherBlaster: Blaster | null;
  activeCharacter: Character | null;
  healingCharacter: Character | null;
  soundSetting: boolean;
  prices: Prices;
  refInfo: RefInfo | null;
  sessionsCount: number | null;
  selectGun: (value: number) => void;
  selectHealingCharacter: (value: number) => void;
  updateCredits: (value: number) => void;
  updateTokens: (value: number) => void;
  updateJwt: (value: string | null) => void;
  auth: (value: string) => void;
  startCheckBalance: () => void;
  setCheckGun: (value: boolean) => void;
  sendSocketMessage: (value: string) => void;
  setSoundSetting: (value: boolean) => void;
  updateUserInfo: (value: string) => void;
  resetUserData: () => void;
  game1State: boolean | null;
  setGame1State: (value: boolean) => void;
  homeState: boolean | null;
  setHomeState: (value: boolean) => void;
}

const defaultValue: UserDataContextType = {
  userDataDefined: false,
  credits: 0,
  tokens: 0,
  tons: 0,
  sessionsCount: null,
  exchangeRate: 0,
  jwt: "",
  checkGun: false,
  userMetrics: {
    total_deposited: 0,
    total_earned_tokens: 0,
    earn_required: 0,
    earned: 0,
    akronix_won: 0,
    credits_won: 0,
    ton_won: 0,
  },
  blasters: [],
  characters: [],
  higherBlaster: null,
  activeBlaster: null,
  activeCharacter: null,
  healingCharacter: null,
  soundSetting: true,
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
  refInfo: null,
  selectGun: () => {},
  updateCredits: () => {},
  updateTokens: () => {},
  updateJwt: () => {},
  setCheckGun: () => {},
  selectHealingCharacter: () => {},
  auth: () => {},
  startCheckBalance: () => {},
  sendSocketMessage: () => {},
  setSoundSetting: () => {},
  updateUserInfo: () => {},
  resetUserData: () => {},
  game1State: null,
  setGame1State: () => {},
  homeState: null,
  setHomeState: () => {},
};

const UserDataContext = createContext<UserDataContextType>(defaultValue);

interface UserDataProviderProps {
  children: ReactNode;
}

export function UserDataProvider({ children }: UserDataProviderProps) {
  const { openDrawer, isOpen, drawerText } = useDrawer();
  const [tonConnectUI] = useTonConnectUI();

  const [jwt, setJwt] = useState<string | null>(
    localStorage.getItem("auth_jwt")
  );

  const [credits, setCredits] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [tons, setTons] = useState(0);
  const [soundSetting, setSoundSetting] = useState(
    localStorage.getItem("sound_setting") === "on"
      ? true
      : localStorage.getItem("sound_setting") === "off"
      ? false
      : true
  );
  const [userMetrics, setUserMetrics] = useState<UserMetrics>({
    total_deposited: 0,
    total_earned_tokens: 0,
    earn_required: 0,
    earned: 0,
    akronix_won: 0,
    ton_won: 0,
    credits_won: 0,
  });
  const { t } = useTranslation();
  const [exchangeRate, setExchangeRate] = useState(0);
  const [sessionsCount, setSessionsCount] = useState(null);

  const [healingCharacter, setHealingCharacter] = useState<Character | null>(
    null
  );

  const [activeBlaster, setActiveBlaster] = useState<Blaster | null>(null);
  const [higherBlaster, setHigherBlaster] = useState<Blaster | null>(null);
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(
    null
  );
  const [blasters, setBlasters] = useState<Blaster[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
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

  const [refInfo, setRefInfo] = useState<RefInfo | null>(null);

  const [checkBalance, setCheckBalance] = useState(false);
  const [checkGun, setCheckGunChange] = useState(false);
  //const [shouldReconnectFlag, setShouldReconnectFlag] = useState(true);

  const tonsRef = useRef<number>(tons);
  const blastersRef = useRef<Blaster[]>(blasters);
  const charactersRef = useRef<Character[]>(characters);

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

  const selectHealingCharacter = (type: number) => {
    const character = characters.find((item) => item.type === type);
    if (character) setHealingCharacter(character);
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

  const setCheckGun = (value: boolean) => {
    setCheckGunChange(value);
  };

  const sendSocketMessage = () => {};

  const auth = async (jwt: string) => {
    try {
      const searchParams = new URLSearchParams(window.location.search); // Извлекаем строку параметров до хэша
      const idParam = searchParams.get("id");
      const id = idParam !== null ? Number(idParam) : -1;

      const response = await fetch(SERVER_URL + "/main/auth", {
        method: "POST", // или 'POST', в зависимости от требований к API
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`, // Добавление токена в заголовок
        },
        body: JSON.stringify({
          chat_id: id,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      return data.code === 1;
    } catch (error) {
      console.error("Failed to authenticate:", error);
      return false;
    }
  };
  const updateUserInfo = async (jwt: string) => {
    try {
      const response = await fetch(SERVER_URL + "/main/getUserInfo", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCredits(data.credits);
      setTons(data.tons);
      setTokens(data.tokens);
      setExchangeRate(data.exchange_rate);
      setSessionsCount(data.sessions);
      const userMetricsData: UserMetrics = data.metrics_response;
      setUserMetrics(userMetricsData);
      const activeCharacter: Character | null = data.active_character;
      setActiveCharacter(activeCharacter);

      const blasters: Blaster[] = data.blasters;
      const pricesResponse: Prices = data.prices;
      const refInfo: RefInfo = data.ref_info;
      const characters: Character[] = data.characters;
      setCharacters(characters);
      setPrices(pricesResponse);
      setRefInfo(refInfo);
      setBlasters(blasters);
      if (blasters.length > 0)
        setHigherBlaster(calculateHighestLevelBlaster(blasters));
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  useEffect(() => {
    if (tonsRef.current < tons && checkBalance) {
      openDrawer!("resolved", "bottom", t("shopModal.accountFilled"));
      setCheckBalance(false);
    }
    tonsRef.current = tons;
  }, [tons, checkBalance]);

  useEffect(() => {
    if (blastersRef.current.length < blasters.length && checkBalance) {
      try {
        const newBlaster = blasters.filter(
          (item2) =>
            !blastersRef.current.some((item1) => item1.level === item2.level)
        )[0];
        if (newBlaster.level != 1) {
          openDrawer!("resolved", "bottom", t("shopModal.blasterFilled"));
          setCheckBalance(false);
        }
      } catch (e) {
        //
      }
    }
    blastersRef.current = blasters;
  }, [blasters, checkBalance]);

  useEffect(() => {
    if (charactersRef.current.length < characters.length && checkBalance) {
      openDrawer!("resolved", "bottom", t("shopModal.characterFilled"));
      setCheckBalance(false);
    }
    charactersRef.current = characters;
  }, [characters, checkBalance]);

  const [userDataDefined, setUserDataDefined] = useState(false);

  useEffect(() => {
    let interval: any; // вынеси переменную выше
    if (!jwt) {
      setUserDataDefined(true);
    }
    if (jwt != null && jwt !== "") {
      const authenticateUser = async () => {
        const isLogged = await auth(jwt);
        if (!isLogged) {
          ProofApiService.reset();
          if (tonConnectUI.connected) {
            await tonConnectUI.disconnect();
          }
          setUserDataDefined(true);
          return;
        } else {
          await updateUserInfo(jwt);
          setUserDataDefined(true);
        }

        interval = setInterval(() => {
          if (jwt && jwt !== "") {
            const refreshUserInfo = async () => {
              await updateUserInfo(jwt);
              setUserDataDefined(true);
            };
            refreshUserInfo();
          }
        }, 20000);
      };

      authenticateUser();
    } else if (tonConnectUI.connected) {
      tonConnectUI.disconnect();
      setUserDataDefined(true);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [jwt]);

  useEffect(() => {
    setJwt(localStorage.getItem(ProofApiService.localStorageKey));
    const soundSavedSetting = localStorage.getItem("sound_setting");
    if (!soundSavedSetting) setSoundSetting(true);
    else if (soundSavedSetting == "on") setSoundSetting(true);
    else setSoundSetting(false);
  }, []);

  const calculateHighestLevelBlaster = (blasters: Blaster[]) => {
    return blasters.reduce((highest: Blaster, blaster: Blaster) => {
      if (blaster.usage > 0 && blaster.level > (highest.level || 0)) {
        return blaster;
      }
      return highest;
    });
  };

  const resetUserData = () => {
    setCredits(0);
    setTokens(0);
    setTons(0);
    setJwt(null);
    setSoundSetting(true);
    // @ts-ignore
    setUserMetrics({
      total_deposited: 0,
      total_earned_tokens: 0,
      earn_required: 0,
      earned: 0,
    });
    setExchangeRate(0);
    setSessionsCount(null);
    setActiveBlaster(null);
    setHigherBlaster(null);
    setActiveCharacter(null);
    setHealingCharacter(null);
    setBlasters([]);
    setCharacters([]);
    setPrices({
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
    setRefInfo(null);
  };

  const [game1State, setGame1State] = useState<boolean | null>(null);
  const [homeState, setHomeState] = useState<boolean | null>(null);

  return (
    <UserDataContext.Provider
      value={{
        refInfo,
        credits,
        tokens,
        tons,
        jwt,
        activeBlaster,
        higherBlaster,
        exchangeRate,
        blasters,
        characters,
        activeCharacter,
        healingCharacter,
        prices,
        userMetrics,
        checkGun,
        soundSetting,
        sessionsCount,
        setSoundSetting,
        selectGun,
        selectHealingCharacter,
        updateCredits,
        updateTokens,
        updateJwt,
        setCheckGun,
        startCheckBalance,
        sendSocketMessage,
        updateUserInfo,
        resetUserData,
        userDataDefined,
        game1State,
        setGame1State,
        homeState,
        setHomeState,
        auth,
      }}
    >
      {children}
      <Drawer isOpen={isOpen!} drawerText={drawerText} />
    </UserDataContext.Provider>
  );
}

export const useUserData = () => useContext(UserDataContext);

export interface Blaster {
  id: number; // long в C# соответствует number в TypeScript
  owner: string; // string
  level: number; // int
  usage: number; // int
  max_usage: number;
  charge: number; // int
  max_charge: number; // int// double соответствует number в TypeScript
  damage: number; // uint в C# соответствует number в TypeScript
  damage_level: number; // int
  max_charge_level: number; // double соответствует number в TypeScript
  charge_level: number;
  charge_step: number;
}

export interface Character {
  id: number; // long в C# соответствует number в TypeScript
  owner: string; // string
  type: number; // int
  earn_required: number; // int
  earned: number;
  total_earned_tokens: number;
  total_deposited: number;
}

export interface UserMetrics {
  total_deposited: number;
  total_earned_tokens: number;
  earned: number;
  earn_required: number;
  akronix_won: number;
  ton_won: number;
  credits_won: number;
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

export interface RefInfo {
  invited: 0;
  invited_ranked: 0;
  total_deposited: 0;
  total_rewards: 0;
  invite_link: string;
  invited_users: InvitedUser[];
}

export interface InvitedUser {
  type: number;
  value: string;
  reward: number;
}

export const BlastersData = [
  {
    level: 1,
    name: "PISTOL M-002",
    price: 0,
    payload: "none",
    rarity: "base",
    image: bl1Img,
  },
  {
    level: 2,
    name: "FG-13 ELITE",
    price: 2,
    payload: "te6cckEBAQEADgAAGPbRsjsAAAABAAAAAqwzHw4=",
    rarity: "common",
    image: bl2Img,
  },
  {
    level: 3,
    name: "EF-4 SHORTLIGHT",
    price: 10,
    payload: "te6cckEBAQEADgAAGPbRsjsAAAABAAAAA6+wdPw=",
    rarity: "uncommon",
    image: bl3Img,
  },
];

export const CharactersData = [
  {
    type: 1,
    name: "DEALER WATTO",
    damage: 1,
    charge_step: 0,
    price: 0.5,
    payload: "",
    payload_heal: "te6cckEBAQEADgAAGPbRsjsAAAABAAAAHxC4aaE=",
    image: ch0Img,
  },
  {
    type: 2,
    name: "B1 BATTLE DROID",
    damage: 2,
    charge_step: 0,
    price: 2,
    payload: "te6cckEBAQEADgAAGPbRsjsAAAABAAAAFtxj29k=",
    payload_heal: "te6cckEBAQEADgAAGPbRsjsAAAABAAAAIIXNmc8=",
    image: ch1Img,
  },
  {
    type: 3,
    name: "REBEL PILOT",
    damage: 10,
    charge_step: 1,
    price: 10,
    payload: "te6cckEBAQEADgAAGPbRsjsAAAABAAAAF9/gsCs=",
    payload_heal: "te6cckEBAQEADgAAGPbRsjsAAAABAAAAIYZO8j0=",
    image: ch2Img,
  },
  {
    type: 4,
    name: "TATOOINE JAWA",
    damage: 30,
    charge_step: 2,
    price: 30,
    payload: "te6cckEBAQEADgAAGPbRsjsAAAABAAAAGPvco3U=",
    payload_heal: "te6cckEBAQEADgAAGPbRsjsAAAABAAAAInK9oi4=",
    image: ch3Img,
  },
  {
    type: 5,
    name: "STORMTROOPER",
    damage: 70,
    charge_step: 4,
    price: 70,
    payload: "te6cckEBAQEADgAAGPbRsjsAAAABAAAAGfhfyIc=",
    payload_heal: "te6cckEBAQEADgAAGPbRsjsAAAABAAAAI3E+ydw=",
    image: ch4Img,
  },
];
