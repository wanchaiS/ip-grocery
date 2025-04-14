import { useSearchParams } from "react-router";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import SearchInput from "@/components/ui/search";
import { AppContext } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { ChevronRight, X } from "lucide-react";
import { use, useRef, useState } from "react";
import { Tables } from "../../utils/database.types";

interface NavCategories {
  [key: string]: string[];
}

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { cart, setCart, products, error, loading } = use(AppContext);

  const [search, setSearch] = useState("");
  const searchFormRef = useRef<HTMLInputElement>(null);

  const categoriesNav = getCategories(products);
  const activeCategory = decodeURIComponent(searchParams.get("category") ?? "");
  const activeSubCategory = decodeURIComponent(
    searchParams.get("sub-category") ?? ""
  );

  const setActiveCategory = (value: string) => {
    if (activeCategory === value) {
      return;
    }
    setSearch("");
    setSearchParams((prev) => ({
      ...prev,
      category: encodeURIComponent(value),
    }));
  };

  const setActiveSubCategory = (category: string, sub: string) => {
    if (activeCategory === category && activeSubCategory === sub) {
      return;
    }
    setSearch("");

    setSearchParams((prev) => ({
      ...prev,
      category: encodeURIComponent(category),
      "sub-category": encodeURIComponent(sub),
    }));
  };

  const resetSearch = () => {
    if (searchFormRef.current !== null) {
      searchFormRef.current.value = "";
    }
    setSearch("");
  };

  if (loading) {
    return <div>Loading....................</div>;
  }

  if (error) {
    return <div>Oops something went wrong. Message: {error.message}</div>;
  }

  const filteredProducts = products.filter((p) => {
    if (search) {
      return (
        p.name.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search)
      );
    }
    if (!activeCategory) {
      return true;
    }
    if (activeSubCategory) {
      return (
        p.category === activeCategory && p.sub_category === activeSubCategory
      );
    }
    return p.category === activeCategory;
  });

  const getCurrenetDisplayingProductsFilter = () => {
    if (search) {
      return (
        <span className="bg-blue-200 flex items-center h-6 rounded-xl p-1 pl-4 ">
          {search}
          <X
            onClick={() => resetSearch()}
            color="red"
            width={14}
            height={14}
            className="ml-2 cursor-pointer"
          />
        </span>
      );
    }
    if (activeCategory || activeSubCategory) {
      return (
        <span
          className={cn(
            "flex justify-start items-center",
            activeSubCategory || activeCategory ? "visible" : "invisible"
          )}
        >
          <span>{activeCategory}</span>
          <ChevronRight
            width={18}
            height={18}
            className="transform translate-y-[1px]"
          />
          <span>{activeSubCategory}</span>
        </span>
      );
    }

    return "All Products";
  };

  const addToCart = (newItem: Tables<"products">) => {
    const productInCartIdx = cart.products.findIndex(
      (p) => p.product.id === newItem.id
    );

    // add quatity to the cart
    if (
      productInCartIdx !== -1 &&
      cart.products[productInCartIdx].qtyInCart < newItem.stock_qty
    ) {
      const updatedProducts = [...cart.products];
      updatedProducts[productInCartIdx].qtyInCart++;
      setCart({ ...cart, products: updatedProducts });
    }
    // add a new product into the carat
    else {
      setCart({
        ...cart,
        products: [...cart.products, { qtyInCart: 1, product: newItem }],
      });
    }
  };

  return (
    <div className="flex space-x-6 rounded-lg">
      <aside className="bg-white shadow-md w-3xs">
        <div
          onClick={() => setSearchParams(undefined)}
          className="cursor-pointer bg-(--secondary) border-b border-b-(--color-border) font-semibold text-lg p-4"
        >
          Categories
        </div>
        <ul>
          {Object.keys(categoriesNav).map((cat) => (
            <Collapsible key={cat}>
              <CollapsibleTrigger asChild>
                <li
                  onClick={() => setActiveCategory(cat)}
                  className="group p-4 flex justify-between cursor-pointer border-b border-b-(--color-border) hover:bg-[var(--hover-color)]  data-[state=open]:border-b-0"
                >
                  <span>{cat}</span>
                  <span className="group-data-[state=open]:hidden group-data-[state=closed]:block">
                    {"+"}
                  </span>
                  <span className="group-data-[state=open]:block group-data-[state=closed]:hidden">
                    {"-"}
                  </span>
                </li>
              </CollapsibleTrigger>
              <CollapsibleContent className="border-b border-b-(--color-border) ">
                <ul className="bg-(--secondary)">
                  {categoriesNav[cat].map((sub) => (
                    <li
                      key={sub}
                      onClick={() => setActiveSubCategory(cat, sub)}
                      className="cursor-pointer  py-2 hover:bg-[var(--hover-color)]"
                    >
                      <span className="pl-8 pr-4">{sub}</span>
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </ul>
      </aside>
      <section className="rounded-lg p-4 bg-white shadow-md flex-grow">
        <div className="mb-4 flex justify-between">
          {getCurrenetDisplayingProductsFilter()}

          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const form = event.currentTarget;
              const formElements = form.elements as typeof form.elements & {
                search: HTMLInputElement;
              };
              // clear search param
              setSearchParams(undefined);
              setSearch(formElements.search.value);
            }}
          >
            <SearchInput
              ref={searchFormRef}
              id="search"
              wrapperClassName="w-[300px] justify-self-end"
              placeholder="Search products"
            />
          </form>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(180px,_1fr))] gap-4">
          {filteredProducts.length > 0
            ? filteredProducts.map((product) => (
                <div
                  className="border border-(--color-border) rounded-lg transition-all duration-100 hover:scale-102 hover:shadow-lg"
                  key={product.id}
                >
                  <div className="border-b border-(-color-border)">
                    <img
                      src={product.url}
                      alt={product.description || undefined}
                      className="h-[140px] w-full rounded-t-lg"
                    />
                  </div>

                  <div className="p-2">
                    <div className="flex justify-between items-center">
                      <h3>{product.name}</h3>
                      <span className="text-xs">
                        {product.stock_qty > 0
                          ? `${product.stock_qty} in stock`
                          : "out of stock"}
                      </span>
                    </div>

                    <span className="text-xs">{product.description}</span>
                    <div className="text-(--primary-color) font-semibold">
                      {product.price}$
                    </div>
                    <div className="px-2">
                      <Button
                        disabled={
                          product.stock_qty <= 0 ||
                          cart.products.find((p) => p.product.id === product.id)
                            ?.qtyInCart === product.stock_qty
                        }
                        onClick={() => addToCart(product)}
                        className={cn(
                          "w-full bg-(--primary-color) hover:bg-[#43a047] mt-2",
                          "cursor-pointer"
                        )}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            : "No products found"}
        </div>
      </section>
    </div>
  );
}

function getCategories(products: Tables<"products">[]): NavCategories {
  const categories: NavCategories = {};

  for (let i = 0; i < products.length; i++) {
    const prod = products[i];
    if (categories[prod.category]) {
      if (!categories[prod.category].includes(prod.sub_category)) {
        categories[prod.category].push(prod.sub_category);
      }
    } else {
      categories[prod.category] = [prod.sub_category];
    }
  }

  return categories;
}
