import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppContext } from "@/context/AppContext";
import usePlaceOrder from "@/hooks/usePlaceorder";
import { Loader2 } from "lucide-react";
import { use, useState } from "react";
import { Link } from "react-router";

export default function OrderPage() {
  const [orderCompleted, setOrderCompleted] = useState(false);
  const { error, loading, handlePlaceOrder } = usePlaceOrder();
  const { cart, setCart } = use(AppContext);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const form = event.currentTarget;
    // const formElements = form.elements as typeof form.elements & {
    //   fullName: HTMLInputElement;
    //   email: HTMLInputElement;
    //   phone: HTMLInputElement;
    //   street: HTMLInputElement;
    //   suburb: HTMLInputElement;
    //   state: HTMLInputElement;
    //   postcode: HTMLInputElement;
    // };
    await handlePlaceOrder(cart, () => {
      setCart({ products: [] });
      setOrderCompleted(true);
    });
  };

  if (orderCompleted) {
    return (
      <div className="mx-auto max-w-4xl bg-white shadow-md rounded-lg p-4">
        <div className="flex items-center justify-center flex-col space-y-4">
          <div>
            You order has been placed! The confirmation has been sent yo you
            email!
          </div>

          <Button className="bg-(--primary-color)  hover:bg-[#43a047] cursor-pointer">
            {" "}
            <Link className="text-white!" to="/">
              Back to shopping
            </Link>{" "}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
      <div className="bg-(--primary-color) p-6 text-lg font-semibold text-white">
        Delivery Details
      </div>

      {/** Form */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/** Name */}
          <div className="flex flex-col md:flex-row items-start md:items-center max-w-lg mx-auto">
            <label
              className="min-w-[140px] font-medium mb-2 md:mb-0"
              htmlFor="fullName"
            >
              Full Name
            </label>
            <Input
              className="w-full md:flex-1"
              type="text"
              id="fullName"
              required
            />
          </div>
          {/** Email */}
          <div className="flex flex-col md:flex-row items-start md:items-center max-w-lg mx-auto">
            <label
              className="min-w-[140px] font-medium mb-2 md:mb-0"
              htmlFor="email"
            >
              Email
            </label>
            <Input
              className="w-full md:flex-1"
              type="email"
              id="email"
              required
              placeholder="format abc@abc.com"
            />
          </div>
          {/** Phone */}
          <div className="flex flex-col md:flex-row items-start md:items-center max-w-lg mx-auto">
            <label
              className="min-w-[140px] font-medium mb-2 md:mb-0"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <Input
              className="w-full md:flex-1"
              type="tel"
              id="phone"
              required
              pattern="[0-9]{10}"
              placeholder="format 10 digits"
            />
          </div>
          {/** Address */}
          <div className="flex flex-col md:flex-row items-start md:items-center max-w-lg mx-auto">
            <label
              className="min-w-[140px] font-medium mb-2 md:mb-0"
              htmlFor="street"
            >
              Street
            </label>
            <Input
              className="w-full md:flex-1"
              type="text"
              id="street"
              required
            />
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center max-w-lg mx-auto">
            <label
              className="min-w-[140px] font-medium mb-2 md:mb-0"
              htmlFor="suburb"
            >
              Suburb
            </label>
            <Input
              className="w-full md:flex-1"
              type="text"
              id="suburb"
              required
            />
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center max-w-lg mx-auto">
            <label
              className="min-w-[140px] font-medium mb-2 md:mb-0"
              htmlFor="state"
            >
              State
            </label>
            <select
              className="w-full md:flex-1 border border-gray-300 rounded-md p-2"
              name="state"
              id="state"
              defaultValue=""
              required
            >
              <option value="NSW">NSW</option>
              <option value="VIC">VIC</option>
              <option value="QLD">QLD</option>
              <option value="WA">WA</option>
              <option value="SA">SA</option>
              <option value="TAS">TAS</option>
              <option value="ACT">ACT</option>
              <option value="NT">NT</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center max-w-lg mx-auto">
            <label
              className="min-w-[140px] font-medium mb-2 md:mb-0"
              htmlFor="postcode"
            >
              Post Code
            </label>
            <Input
              className="w-full md:flex-1"
              type="text"
              id="postcode"
              required
              pattern="[0-9]{5}"
              placeholder="format 5 digits"
            />
          </div>
          {error && (
            <div className="max-w-lg mx-auto text-red-800 border border-red-500 rounded-sm bg-red-200 p-2 ">
              {error}
              <Link className="block" to="/cart">
                Back to shopping cart
              </Link>
            </div>
          )}
          <div className="flex max-w-lg mx-auto justify-end space-x-4">
            <Button className="bg-white cursor-pointer text-black border border-black hover:bg-gray-200 px-4 py-2 rounded-md">
              <Link to="/cart">Back</Link>
            </Button>
            <Button
              type="submit"
              disabled={cart.products.length === 0 || !!error}
              className="bg-(--primary-color) cursor-pointer text-white px-4 py-2 rounded-md hover:bg-[#43a047]"
            >
              {loading && <Loader2 className="animate-spin" />}
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
