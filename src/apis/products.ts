import { Tables } from "@/utils/database.types";
import supabase from "../utils/supabase";


export async function getProducts() {
    return await supabase.from('products').select().order('name', { ascending: true })
}

export async function updateProductQty(orders:Tables<"products">[]){
    return await supabase
    .from('products')
    .upsert(orders)
    
}