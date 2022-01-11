import { RouteConfig } from "react-router-config";
import Home from "./pages/home";
import Inquiry from "./pages/Inquiry";
import Offer from "./pages/offer";

const routes = [
  {
    path: "/",
    component: Home,
    routes: [
      {
        path: "/inquiry",
        component: Inquiry,
      },
      {
        path: "/offer",
        component: Offer,
      },
    ],
  },
];

export default routes;
