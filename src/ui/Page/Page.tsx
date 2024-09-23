import { ReactElement, useEffect } from "react";
import "./styles/Page.css";
import { ModalProvider } from "../../context/ModalContext";
import { DrawerProvider } from "../../context/DrawerContext";
import { LoaderProvider } from "../../context/LoaderContext";
import { UserDataProvider } from "../../UserDataService.tsx";
import { BattleshipsProvider } from "../../context/BattleshipsContext.tsx";
import { BackgroundVideoProvider } from "../../context/BackgroundVideoContext.tsx";
import { SoundProvider } from "../../context/SeaContexts/SoundContext.tsx";

type PageProps = {
  dataPage: string;
  children: ReactElement;
};

export function Page({ dataPage, children }: PageProps) {
  function setDraggableFalse() {
    const images = document.querySelectorAll("img");
    const svgs = document.querySelectorAll("svg");

    images.forEach((img) => img.setAttribute("draggable", "false"));
    svgs.forEach((svg) => svg.setAttribute("draggable", "false"));
  }

  useEffect(() => {
    setDraggableFalse();
  }, [dataPage]);

  useEffect(() => {
    //const handleUnload = (event: BeforeUnloadEvent) => {
    //  // Send a request to the server
    //  navigator.sendBeacon(
    //    "https://socket.akronix.io/shipBattle/ensureEmptyDisabled"
    //  );
    //};
    //window.addEventListener("beforeunload", handleUnload);
    //return () => {
    //  window.removeEventListener("beforeunload", handleUnload);
    //};
  }, []);

  return (
    <LoaderProvider>
      <BackgroundVideoProvider>
        <SoundProvider>
          <BattleshipsProvider>
            <DrawerProvider>
              <UserDataProvider>
                <ModalProvider>
                  <div className="page" data-page={dataPage}>
                    <div className="page__container">
                      <div className="page__container-gradient page__container-gradient--Left"></div>
                      <div className="page__container-gradient page__container-gradient--Right"></div>
                      {children}
                    </div>
                  </div>
                </ModalProvider>
              </UserDataProvider>
            </DrawerProvider>
          </BattleshipsProvider>
        </SoundProvider>
      </BackgroundVideoProvider>
    </LoaderProvider>
  );
}
