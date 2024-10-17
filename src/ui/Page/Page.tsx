import { ReactElement, useEffect } from "react";
import { BackgroundVideoProvider } from "../../context/BackgroundVideoContext.tsx";
import { BattleshipsProvider } from "../../context/BattleshipsContext.tsx";
import { DrawerProvider } from "../../context/DrawerContext";
import { LoaderProvider } from "../../context/LoaderContext";
import { ModalProvider } from "../../context/ModalContext";
import { SomethingProvider } from "../../context/SeaContexts/SomethingContext.tsx";
import { SoundProvider } from "../../context/SeaContexts/SoundContext.tsx";
import { UserDataProvider } from "../../UserDataService.tsx";
import { PageLoader } from "../Modal/PageLoader.tsx";
import "./styles/Page.css";

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
                  <SomethingProvider>
                    <div className="page" data-page={dataPage}>
                      {/* <PageLoader isOpen={true} className="pageLoader" /> */}
                      <div className="page__container">
                        <div className="page__container-gradient page__container-gradient--Left"></div>
                        <div className="page__container-gradient page__container-gradient--Right"></div>
                        {children}
                      </div>
                    </div>
                  </SomethingProvider>
                </ModalProvider>
              </UserDataProvider>
            </DrawerProvider>
          </BattleshipsProvider>
        </SoundProvider>
      </BackgroundVideoProvider>
    </LoaderProvider>
  );
}
