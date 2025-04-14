import { AppContext } from "@/context/AppContext";
import { ShoppingCart } from "lucide-react";
import { PropsWithChildren, use } from "react";
import { Link } from "react-router";

import { cn } from "@/lib/utils";
import "./style.css";

export default function Layout({ children }: PropsWithChildren) {
  const { cart } = use(AppContext);
  return (
    <div className="relative">
      <header className="shadow-md bg-white p-4 flex justify-between items-center sticky top-0 z-100">
        <Link
          to="/"
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        >
          <div className="flex items-center font-[600] text-xl">
            <span className="mr-4 w-[40px] h-[40px] flex items-center justify-center text-white rounded-full bg-(--primary-color)">
              PG
            </span>
            <span>Peter's Grocery</span>
          </div>
        </Link>
        <Link to="/cart">
          <div className="relative cursor-pointer">
            <ShoppingCart />
            {cart.products.length > 0 && (
              <span
                className={cn(
                  " absolute -top-1 -right-2 bg-red-400 w-5 h-5 rounded-full text-white font-semibold flex justify-center items-center border border-red-400"
                )}
              >
                <span className="text-xs">
                  {cart.products.reduce((acc, cur) => acc + cur.qtyInCart, 0)}
                </span>
              </span>
            )}
          </div>
        </Link>
      </header>
      <main className="my-[20px] mx-auto max-w-[1200px]">{children}</main>
    </div>
  );
}
