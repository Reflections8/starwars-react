import { createHashRouter } from "react-router-dom";
import { Game1 } from "../pages/game1/game1";
import { Home } from "../pages/home/Home";
import { Page } from "../ui/Page/Page";

export const router = createHashRouter([
  {
    path: "/",
    element: <Page dataPage={"game1"} children={<Game1 />} />,
  },
  {
    path: "/home",
    element: <Page dataPage={"home"} children={<Home />} />,
  },
]);
