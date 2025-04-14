import { PostgrestError } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { useLocation } from "react-router"
import { getProducts } from "../apis/products"
import { Tables } from "../utils/database.types"

export const useProducts = () => {
    const [error, setError] = useState<PostgrestError | null>(null)
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState<Tables<"products">[]>([])
    const location = useLocation();

    // refetch everytime route change
    useEffect(() => {
      async function refetchProducts() {
        const { data, error } = await getProducts();
        if(!error){
            setProducts(data)
        }else {
            setError(error)
        }
        setLoading(false)
      }

      refetchProducts()

      return () => {
        setError(null)
        setLoading(false)
      }
    }, [location]);

    // fetch data first redner
    useEffect(() => {

      async function fetchProducts() {
        setLoading(true)
        const { data, error } = await getProducts();
        
        if(!error){
            setProducts(data)
        }else {
            setError(error)
        }
        setLoading(false)
      }

      fetchProducts()

      return () => {
        setError(null)
        setLoading(false)
      }
    }, [])

    

    return {products,error,loading}
}