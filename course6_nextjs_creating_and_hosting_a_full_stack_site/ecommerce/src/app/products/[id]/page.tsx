'use client'

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/app/data/product-data";
import NotFoundPage from "@/app/not-found";
import { fetchAllProducts } from "@/app/utils/utils";

export default function ProductDetailsPage({params}: { params: Promise<{ id: string }> }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const resolvedParams = React.use(params);

    useEffect(() => {
        async function loadProduct() {
            setLoading(true);
            try {
                const allProducts = await fetchAllProducts();
                const foundProduct = allProducts.find(p => p.id === resolvedParams.id);
                setProduct(foundProduct || null);
            } catch (error) {
                console.error("Error fetching product:", error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        }

        loadProduct();
    }, [resolvedParams.id]);

    const addToCart = () => {
        const user = localStorage.getItem('user');
        if (!user) {
            alert("Please log in to add items to your cart.");
            return;
        }

        if (product) {
            const cartKey = `${user}_cart`;
            let cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
            cart.push(product);
            localStorage.setItem(cartKey, JSON.stringify(cart));
            alert(`${product.name} has been added to your cart.`);
        }
    };

    const addToFavorite = () => {
        const user = localStorage.getItem('user');
        if (!user) {
            alert("Please log in to add items to your favorites.");
            return;
        }

        if (product) {
            const favoriteKey = `${user}_favorite`;
            let favorites = JSON.parse(localStorage.getItem(favoriteKey) || '[]');
            if (!favorites.some((item: Product) => item.id === product.id)) {
                favorites.push(product);
                localStorage.setItem(favoriteKey, JSON.stringify(favorites));
                alert(`${product.name} has been added to your favorites.`);
            } else {
                alert(`${product.name} is already in your favorites.`);
            }
        }
    };

    if (loading) {
        return <div className="text-center mt-8">Loading...</div>;
    }

    if (!product) {
        return <NotFoundPage />;
    }

    return (
        <div className="container mx-auto p-8">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 mb-4 md:mb-0 md:mr-8">
                    <img className="w-full h-auto rounded-lg shadow-md" src={'/' + product.imageUrl} alt={product.name} />
                </div>
                <div className="md:w-1/2">
                    <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                    <p className="text-2xl text-gray-600 mb-6">${product.price}</p>
                    <p className="text-gray-700 mb-6">{product.description}</p>
                    <div className="flex space-x-4 mb-6">
                        <button onClick={addToCart} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Add to Cart
                        </button>
                        <button onClick={addToFavorite} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                            Add to Favorites
                        </button>
                    </div>
                    <Link href="/products" className="text-blue-500 hover:text-blue-700">
                        ← Back to Products
                    </Link>
                </div>
            </div>
        </div>
    );
}