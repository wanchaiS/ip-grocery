import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppContext } from "@/context/AppContext";
import { Tables } from "@/utils/database.types";
import { Undo2 } from "lucide-react";
import { use } from "react";
import { Link } from "react-router";

export default function CartPage() {
  const { cart, products, setCart } = use(AppContext);

  const reduceItem = (prod: Tables<"products">) => {
    const prodIdx = cart.products.findIndex((up) => up.product.id === prod.id);
    if (prodIdx !== -1) {
      setCart((prev) => {
        const updatedProducts = [...prev.products];

        updatedProducts[prodIdx] = {
          ...updatedProducts[prodIdx],
          qtyInCart: updatedProducts[prodIdx].qtyInCart - 1,
        };
        const updatedCart = { ...cart, products: updatedProducts };
        return updatedCart;
      });
    }
  };

  const increaseItem = (prod: Tables<"products">) => {
    const prodIdx = cart.products.findIndex((up) => up.product.id === prod.id);
    if (prodIdx !== -1) {
      setCart((prev) => {
        const updatedProducts = [...prev.products];

        updatedProducts[prodIdx] = {
          ...updatedProducts[prodIdx],
          qtyInCart: updatedProducts[prodIdx].qtyInCart + 1,
        };
        const updatedCart = { ...cart, products: updatedProducts };
        return updatedCart;
      });
    }
  };

  const updateItemCount = (newVal: number, prod: Tables<"products">) => {
    const prodIdx = cart.products.findIndex((up) => up.product.id === prod.id);
    if (prodIdx !== -1) {
      setCart((prev) => {
        const updatedProducts = [...prev.products];

        updatedProducts[prodIdx] = {
          ...updatedProducts[prodIdx],
          qtyInCart: newVal,
        };
        const updatedCart = { ...cart, products: updatedProducts };
        return updatedCart;
      });
    }
  };

  const removeItemCart = (prod: Tables<"products">) => {
    const prodIdx = cart.products.findIndex((up) => up.product.id === prod.id);
    if (prodIdx !== -1) {
      setCart((prev) => {
        const updatedProducts = [...prev.products];
        updatedProducts.splice(prodIdx, 1);

        const updatedCart = { ...cart, products: updatedProducts };
        return updatedCart;
      });
    }
  };

  const clearCart = () => {
    setCart((prev) => ({ ...prev, products: [] }));
  };

  const totalPrice = cart.products.reduce((acc, cur) => {
    return acc + cur.product.price * cur.qtyInCart;
  }, 0);

  return (
    <div className="mx-auto max-w-4xl bg-white shadow-md relative">
      <div className="bg-(--primary-color) p-4 text-lg font-semibold text-white">
        <div className="flex">
          <Link to="/">
            <Undo2 className="mr-4 cursor-pointer" />
          </Link>{" "}
          Shopping Cart
        </div>
      </div>
      <div className="p-4 ">
        {/** Product card */}
        {cart.products.map((pcart) => {
          const product = products.find((p) => p.id === pcart.product.id);
          return (
            <div
              key={pcart.product.id}
              className="p-4 flex   border-b border-b-(--color-border) space-x-6"
            >
              <img
                src={pcart.product.url}
                alt={pcart.product.description || ""}
                width={200}
                height={200}
              />
              <div className="flex flex-col">
                <div className="grow">
                  <h3 className="font-semibold">{pcart.product.name}</h3>
                  <div className="text-xs">{pcart.product.description}</div>
                  <div className="text-xs">
                    {product?.stock_qty || 0 > 0
                      ? `${product?.stock_qty} in stock`
                      : "out of stock"}
                  </div>
                  <div className="font-semibold mt-2">
                    ${pcart.product.price}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    className="bg-(--primary-color)  hover:bg-[#43a047] cursor-pointer"
                    disabled={pcart.qtyInCart <= 0}
                    onClick={() => reduceItem(pcart.product)}
                  >
                    -
                  </Button>
                  <Input
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateItemCount(Number(e.target.value), pcart.product)
                    }
                    type="number"
                    value={pcart.qtyInCart}
                    className="max-w-[80px]"
                  />
                  <Button
                    className="bg-(--primary-color)  hover:bg-[#43a047] cursor-pointer"
                    disabled={pcart.qtyInCart >= (product?.stock_qty || 0)}
                    onClick={() => increaseItem(pcart.product)}
                  >
                    +
                  </Button>
                  <Button
                    className="ml-4 bg-red-500 cursor-pointer hover:bg-red-900"
                    onClick={() => removeItemCart(pcart.product)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-0 z-100 h-30 bg-white shadow-md p-4 space-y-4">
        <div className="flex justify-between font-bold text-xl">
          <div>Total:</div>
          <div>${totalPrice.toFixed(2)}</div>
        </div>
        <div className="flex justify-between ">
          <Button
            onClick={() => clearCart()}
            className="bg-[#ffc107] hover:bg-[#e0a806] cursor-pointer"
          >
            Clear Cart
          </Button>
          <Button
            disabled={cart.products.length === 0}
            className="bg-(--primary-color)  hover:bg-[#43a047] cursor-pointer"
          >
            <Link className="text-white!" to="/order">
              Place Order
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
