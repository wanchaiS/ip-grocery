import { useProducts } from "@/hooks/useProducts";
import useLocalStorage from "@/hooks/useStorage";
import { Tables } from "@/utils/database.types";
import { PostgrestError } from "@supabase/supabase-js";
import { createContext, PropsWithChildren } from "react";

export interface CartProduct {
  product: Tables<"products">;
  qtyInCart: number;
}
export interface Cart {
  products: CartProduct[];
}
interface AppContextType<T> {
  cart: Cart;
  products: Tables<"products">[];
  error: PostgrestError | null;
  loading: boolean;
  setCart: React.Dispatch<React.SetStateAction<T>>;
}

const AppContext = createContext<AppContextType<Cart>>({
  cart: { products: [] },
  products: [],
  error: null,
  loading: false,
  setCart: () => {},
});

const AppContextProvider = ({ children }: PropsWithChildren) => {
  const [cart, setCart] = useLocalStorage<Cart>("cart", { products: [] });
  const { products, error, loading } = useProducts();

  return (
    <AppContext.Provider value={{ cart, products, error, loading, setCart }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
