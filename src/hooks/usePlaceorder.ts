import { getProducts, updateProductQty } from "@/apis/products";
import { Cart } from "@/context/AppContext";
import { Tables } from "@/utils/database.types";
import { useState } from "react";

const usePlaceOrder = () => {
    const [error, setError] = useState<string|null>(null)
    const [loading, setLoading] = useState(false)

    const handlePlaceOrder = async (cart: Cart, onCompleted: () => void) => {
        setLoading(true)

         // fetch products
        const products = await getProducts()

    if(products.error){
        setError("Error retrieving products")
        setLoading(false)
        return
    }

    const validOrders: Tables<"products">[] = []

    // check if products have enough qty
    for (let i = 0; i < cart.products.length; i++) {
        const cartOrder = cart.products[i];


        const prod = products.data.find(p => p.id === cartOrder.product.id)
        if(prod === undefined){
            setError(`Unable to find product ${cartOrder.product.name} in the database`)
            setLoading(false)
            return
        }
        if(cartOrder.qtyInCart > prod.stock_qty){
            setLoading(false)
            setError(`Out of stock for ${cartOrder.product.name} (current stock: ${prod.stock_qty})`)
            return
        }


        if(cartOrder.qtyInCart > 0) {
            validOrders.push({...prod,stock_qty: prod.stock_qty - cartOrder.qtyInCart})
        }
    }

    
     const { error:serverError} = await updateProductQty(validOrders)
     if(serverError){
        setLoading(false)
        setError(serverError.message)
        return
     }
     
     // completed
     setLoading(false)
     onCompleted();
    }

    return {loading,error,handlePlaceOrder}


}

export default usePlaceOrder