import { createHashRouter } from "react-router-dom";
import { Game1 } from "../pages/game1/game1";
import { Home } from "../pages/home/Home";
import { Page } from "../ui/Page/Page";
import { Auth } from "../pages/auth/Auth";

export const router = createHashRouter([
  {
    path: "/",
    element: <Page dataPage={"home"} children={<Home />} />,
  },
  {
    path: "/game1",
    element: <Page dataPage={"game1"} children={<Game1 />} />,
  },
  {
    path: "/auth",
    element: <Page dataPage={"auth"} children={<Auth />} />,
  },
]);
