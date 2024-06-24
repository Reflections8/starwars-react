import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";
import { HomeIcon } from "../../icons/Home";
import { MenuIcon } from "../../icons/Menu";
import "./styles/game1.css";
import { useCallback, useEffect, useState } from "react";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import { useInitData } from "@vkruglikov/react-telegram-web-app";
import {HeaderCenterCredits} from "../../components/Header/components/HeaderCenter/HeaderCenterCredits.tsx";
import {useUnityContext} from "react-unity-webgl/distribution/hooks/use-unity-context";
import {Unity} from "react-unity-webgl/distribution/components/unity-component";

export function Game1() {
    const [devicePixelRatio, setDevicePixelRatio] = useState(
        window.devicePixelRatio
    );

    const [initDataUnsafe] = useInitData();

    const [score, setScore] = useState(0);
    const [damage, setDamage] = useState(1);
    const [blasterCharge, setBlasterCharge] = useState(0);
    const [blasterChargeExt, setBlasterChargeExt] = useState(0);

    const [isUnityLoaded, setIsUnityLoaded] = useState(false);

    const {
        unityProvider,
        loadingProgression,
        isLoaded,
        sendMessage,
        addEventListener,
        removeEventListener,
    } = useUnityContext({
        loaderUrl: "build/Build_Ios.loader.js",
        dataUrl: "build/Build_Ios.data.gz",
        frameworkUrl: "build/Build_Ios.framework.js.gz",
        codeUrl: "build/Build_Ios.wasm.gz",
    });

    useEffect(
        function () {
            // A function which will update the device pixel ratio of the Unity
            // Application to match the device pixel ratio of the browser.
            const updateDevicePixelRatio = function () {
                setDevicePixelRatio(window.devicePixelRatio);
            };
            // A media matcher which watches for changes in the device pixel ratio.
            const mediaMatcher = window.matchMedia(
                `screen and (resolution: ${devicePixelRatio}dppx)`
            );

            // Adding an event listener to the media matcher which will update the
            // device pixel ratio of the Unity Application when the device pixel
            // ratio changes.
            mediaMatcher.addEventListener("change", updateDevicePixelRatio);
            return function () {
                // Removing the event listener when the component unmounts.
                mediaMatcher.removeEventListener("change", updateDevicePixelRatio);
            };
        },
        [devicePixelRatio]
    );

    useEffect(() => {
        if (isLoaded && isUnityLoaded) {
            if (initDataUnsafe?.user?.id != undefined) {
                sendMessage(
                    "GameManager",
                    "OnUserIdReceive",
                    initDataUnsafe?.user?.id.toString()
                );
                console.log(initDataUnsafe?.user?.id);
            } else {
                sendMessage("GameManager", "OnUserIdReceive", "1");
                console.log("not found tg data, starting 1 user id");
            }
        }
        return () => {};
    }, [isLoaded, isUnityLoaded]);

    const handleLoadingFinish = useCallback(() => {
        setIsUnityLoaded(true);
    }, []);

    const handleSetScore = useCallback((score: ReactUnityEventParameter) => {
        setScore(score as number);
    }, []);

    const handleSetBlasterCharge = useCallback(
        (score: ReactUnityEventParameter) => {
            setBlasterCharge(score as number);
        },
        []
    );

    const handleSetBlasterChargeExt = useCallback(
        (score: ReactUnityEventParameter) => {
            setBlasterChargeExt(score as number);
        },
        []
    );

    const handleSetBlasterDamage = useCallback(
        (score: ReactUnityEventParameter) => {
            setDamage(score as number);
        },
        []
    );

    useEffect(() => {
        localStorage.clear();
        addEventListener("LoadFinish", handleLoadingFinish);
        addEventListener("SetBlasterCharge", handleSetBlasterCharge);
        addEventListener("SetBlasterChargeExt", handleSetBlasterChargeExt);
        addEventListener("SetScore", handleSetScore);
        addEventListener("SetDamage", handleSetBlasterDamage);
        return () => {
            removeEventListener("SetBlasterCharge", handleSetBlasterCharge);
            removeEventListener("SetBlasterChargeExt", handleSetBlasterChargeExt);
            removeEventListener("SetScore", handleSetScore);
            removeEventListener("SetDamage", handleSetBlasterDamage);
            removeEventListener("LoadFinish", handleLoadingFinish);
        };
    }, [
        addEventListener,
        removeEventListener,
        handleLoadingFinish,
        handleSetScore,
        handleSetBlasterCharge,
        handleSetBlasterChargeExt,
        handleSetBlasterDamage,
    ]);

    return (
        <>
            <Header
                leftIcon={<HomeIcon />}
                leftText={"Домой"}
                leftLink={"/home"}
                rightIcon={<MenuIcon />}
                rightText={"Меню"}
                centerComponent={<HeaderCenterCredits credits={score} />}
            />

            {!isLoaded && (
                <p style={{ visibility: !isLoaded ? "visible" : "hidden" }}>
                    Loading Application... {Math.round(loadingProgression * 100)}%
                </p>
            )}
            <Unity
                unityProvider={unityProvider}
                style={{
                    visibility: isLoaded ? "visible" : "hidden",
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                }}
                devicePixelRatio={devicePixelRatio}
                className="mainWrapper"
            />

            <Footer power={damage} clip={blasterChargeExt} charges={blasterCharge} />
        </>
    );
}
