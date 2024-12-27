import {Product} from "@/app/data/product-data";

export async function fetchAllProducts(){
    // Fetch products from the API route
    const response = await fetch('http://localhost:3000/api/products', {
        method: 'GET',
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    const products: Product[] = await response.json();

    return products;
}