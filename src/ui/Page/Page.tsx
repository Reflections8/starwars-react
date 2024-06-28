import { ReactElement } from "react";
import "./styles/Page.css";
import { ModalProvider } from "../../context/ModalContext";
import { DrawerProvider } from "../../context/DrawerContext";
import { LoaderProvider } from "../../context/LoaderContext";

type PageProps = {
  dataPage: string;
  children: ReactElement;
};

export function Page({ dataPage, children }: PageProps) {
  return (
    <LoaderProvider>
      <DrawerProvider>
        <ModalProvider>
          <div className="page" data-page={dataPage}>
            <div className="page__container">
              <div className="page__container-gradient page__container-gradient--Left"></div>
              <div className="page__container-gradient page__container-gradient--Right"></div>
              {children}
            </div>
          </div>
        </ModalProvider>
      </DrawerProvider>
    </LoaderProvider>
  );
}
