// localhost:3000/products/<product-id>
'use client'

import {Product, products} from "@/app/data/product-data";
import NotFoundPage from "@/app/not-found";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {fetchAllProducts} from "@/app/utils/utils";

// function renderOneProductDetails(product: TypeOfProduct, addToCart:typeOfAddToCart)
function renderOneProductDetails(product: Product, addToCart:()=>void) {
    return ( // using tailwind CSS for styling
        <div className="container mx-auto p-8">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 mb-4 md:mb-0 md:mr-8">
                    <img className="w-full h-auto rounded-lg shadow-md"
                         src={'/' + product!.imageUrl} alt={product!.name}/>
                </div>

                <div className="md:w-1/2">
                    <p className="text-4xl font-bold mb-4">{product!.name}</p> {/*The ! operator tells TypeScript that you're certain that product is not null or undefined at this point in the code.*/}
                    <p className="text-2xl text-gray-600 mb-6">(Product ID: {product.id}) ${product!.price}</p>
                    <h3 className="text-2xl font-semibold mb-2"> Description</h3>
                    <p className="text-gray-700">{product!.description}</p>

                    {/* Add to Cart Button */}
                    <button
                        onClick={addToCart} //implement this addToCart() function*/
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">
                        Add to Cart
                    </button>

                    {/* Add to Favorites Button */}
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Add to Favorites
                    </button>

                    {/* Back to Products Link */}
                    <div className="mt-6">
                        <Link href="/products" className="text-blue-500 hover:text-blue-700">
                            ← Back to Products
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}


// create a simple product details page
// We added a 'params' prop to the ProductDetailsPage function. This prop is automatically provided by Next.js for dynamic routes.
// We typed the params prop to expect an object with an 'id' property of type string.

// 'params' is a Javascript object which has an 'id' property of type 'string'
// params is a promise which has a property called 'id' of type 'string'
export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }){
    const [product, setProduct]= useState<Product|null>(null); // to manage the local state of the product i.e. is the product ID is of a valid product
    const resolvedParams = React.use(params);

    // whenever there is a change in localhost:3000/products/123 in the prouct id in the URL, trigger the useEffect
    useEffect(() => {
        const foundProduct= products.find(p=>p.id===resolvedParams.id);
        setProduct(foundProduct!==undefined?foundProduct:null);
    }, [resolvedParams.id]);

    // Await the params to ensure they're properly resolved
    // const {id} = await params;

    // implement the addToCart function
    /*
    - when a user cliek the "Add to Cart" button, the addToCart function is called
    - this function first checks if there's an existing cart in localStorage (<=5MB; localStorage is a web storage object available in modern browsers that allows you to store key-value pair in the browser).
    - if there is no cart, it initializes an empty array
     */

    const addToCart=()=>{
        if (product){ // only try to addToCart is there is a valid product, else no
            // get existing cart items from browser's localstorage (browser has a localStorage of 5MB)
            const existingCart=JSON.parse(localStorage.getItem('cart')||'[]');

            // Add the new product
            existingCart.push(product);

            // Save back to localStorage
            localStorage.setItem('cart',JSON.stringify(existingCart));
            console.log(`Existing Cart items in localstorage ${existingCart.map((pr:Product)=>pr.name).join(', ')}`);
            alert(`${product.name} is added to cart!`);
        }
    };


    // find the product with the matching id
    // const product = products.find(p => p.id === id)
    if (!product) {// if the /products/444 where 444 is the product-id not found in the product list
        return <NotFoundPage/>
    }
    return renderOneProductDetails(product,addToCart);
}