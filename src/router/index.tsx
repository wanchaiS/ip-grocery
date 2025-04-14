import CartPage from "@/pages/cart/CartPage";
import HomePage from "@/pages/home/HomePage";
import OrderPage from "@/pages/order/OrderPage";
import { createBrowserRouter, Navigate } from "react-router";
import Providers from "../Providers";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Providers />,
      children: [
        {
          index: true,
          element: <Navigate to="/home" replace />,
        },
        {
          path: "/home",
          element: <HomePage />,
        },
        {
          path: "/cart",
          element: <CartPage />,
        },
        {
          path: "/order",
          element: <OrderPage />,
        },
      ],
    },
  ],
  { basename: "/ip-grocery" }
);

export default router;
