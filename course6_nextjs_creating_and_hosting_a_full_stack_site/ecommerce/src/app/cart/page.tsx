// update the cart page to use the dynamic cart
"use client"

import {useEffect, useState} from "react";
import { Product, products } from "@/app/data/product-data";
import Link from "next/link";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {fetchAllProducts} from "@/app/utils/utils";

const renderCartItems = (cartProducts: Product[], onDelete:(id:string)=>void) => {
    return cartProducts.map((product,index) => (
        <div key={`${product.id}-${index}`} className="flex items-center border-b border-gray-200 py-4">
            <Link href={"/products/" + product.id} className="flex items-center w-full">
                <div className="w-24 h-24 mr-4 relative">
                    <Image
                        src={'/' + product.imageUrl}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                    />
                </div>
                <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-600">Product ID: {product.id}</p>
                    <p className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</p>
                </div>
            </Link>
            <button
                onClick={() => onDelete(product.id)}
                className="ml-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
                Delete
            </button>
        </div>
    ));
};

// render the cart page
const renderCart = (cartProducts: Product[], totalPrice: number, deleteProduct: (id: string) => void) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Shopping Cart</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {cartProducts.length > 0 ? (
                    <>
                        <div className="p-4">
                            {renderCartItems(cartProducts, deleteProduct)} {/* render the cart items*/}
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-900">Total:</span>
                                <span className="text-2xl font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
                            </div>
                            <Link href={`/checkout?items=${cartProducts.map(p => p.id).join(',')}`} className="block mt-4 w-full">
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                                    Proceed to Checkout
                                </button>
                            </Link>
                        </div>
                    </>
                ) : (
                    <p className="p-4 text-gray-600">Your cart is empty.</p>
                )}
            </div>
            <div className="mt-6">
                <Link href="/products" className="text-blue-600 hover:text-blue-800">
                    ← Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default function CartPage() {
    //const [cartProductIDs] = useState<string[]>(["111","100", "123", "345", "999"]);
    const [cartProducts, setCartProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const router=useRouter(); // its a hook

    // Function to clear cart and redirect to /products
    const clearCartAndRedirect = () => {
        console.log("Clearing cart and redirecting to the /products page");
        localStorage.removeItem('cart');
        setCartProducts([]);
        router.push("/products");
    };


    // useRouter() hook to redirect the user to the /products page if there are no items in the cart

    useEffect(() => {
        const fetchProductsAndUpdateCart = async () => {
            try {
                // Fetch all products, including newly added ones
                const fetchedProducts = await fetchAllProducts();
                setAllProducts(fetchedProducts);

                // Get cart items from local storage
                const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');

                // Find corresponding products in the fetched product list
                const validCartProducts: Product[] = cartItems.filter((item: Product) =>
                    fetchedProducts.some(p => p.id === item.id)
                );

                setCartProducts(validCartProducts);

                // If the cart is empty, redirect to the product page
                if (validCartProducts.length === 0) {
                    console.log("No valid items found in the cart. Redirecting to the /products page");
                    clearCartAndRedirect();
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                clearCartAndRedirect();
            }
        };

        fetchProductsAndUpdateCart().catch((error)=>{
            console.error("Error fetching products and updating cart:", error);
            clearCartAndRedirect(); // redirect to /products page in case of any error while fetching products
        });
    }, [router]); // useEffect() hook in this component will execute only once when the component mounts.
    // what woudl happen if we dont use 'router' in the dependency array?

    // Delete a product from cart
    const deleteProduct=(id:string)=>{
        const indexToRemove = cartProducts.findIndex(product=>product.id===id); // returns the first product matching the condition
        // if the item to be deleted is found
        if(indexToRemove!==-1){
            const updateCart=[...cartProducts];
            updateCart.splice(indexToRemove,1); // removes the single item at index found
            setCartProducts(updateCart);
            localStorage.setItem('cart',JSON.stringify(cartProducts));

            // if the cart becomes empty after deletion, redirect to teh products page
            if (updateCart.length===0){
                console.log("Cart becomes empty after item deletions. Redirecting to the /products page");
                // Clear the cart in localStorage and redirect to /pages
                clearCartAndRedirect();
            }

        }
    };

    console.log("Products in cart: ", cartProducts.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price
    })));

    const totalPrice = cartProducts.reduce((sum, product) => sum + product.price, 0);

    console.log(`Total Cost of all items in the cart: ${totalPrice}`);

    return renderCart(cartProducts,totalPrice,deleteProduct);
}