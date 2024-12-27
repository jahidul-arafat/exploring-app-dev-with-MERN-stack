import Image from "next/image";
import Link from "next/link";
import {Product} from "@/app/data/product-data"; // importing the interface Product{}
// create a simple product list component
/*

The function expects a single object as its argument.
This object should have a property named products.
The type of the products property is an array of Product objects (Product[]).
The curly braces {} in the parameter list are used for object destructuring, allowing you to directly access the products property of the passed object.

- When you use this component, you would call it like this: <ProductsList products={someArrayOfProducts} />

: {products: Product[]}: This part explicitly defines the type of the entire parameter object. It's saying that the function expects an object with a products property that is an array of Product objects.
 */

/*
Glimpse of the Product
{
        id: '123',
        name: 'Hat',
        imageUrl: 'hat.jpg',
        description: 'Cheer the team on in style with our unstructured, low crown, six-panel baseball cap made of 100% organic cotton twill. Featuring our original Big Star Collectibles artwork, screen-printed with PVC- and phthalate-free inks. Complete with matching sewn ventilation eyelets, and adjustable fabric closure.',
        price: 29,
}
 */

function renderAProduct(product: Product,index:number) {
    return (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
            <Link key={`${product.id}-${index}`} href={"/products/" + product.id}>
                <div className="p-4">
                    <Image className="w-full h-48 object-cover mb-4" src={'/' + product.imageUrl} alt={product.name}
                           width={150} height={150}/>
                    <h2 className="text-sm text-gray-600 mb-2">{`Product ID: ${product.id}`}</h2>
                    <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                    <p className="text-blue-600 font-bold">${product.price}</p>
                </div>
            </Link>
        </div>
    );
}

/*
Why key in Div where each Div is a child component of the Parent component ProductsList
------
Here's why this is important:

1. Uniqueness: Each key should be unique among siblings. In this case, product.id is a good choice because it's likely unique for each product.
2. Stability: The key should be consistent across re-renders. Using product.id is good because it's tied to the data and won't change unless the product itself changes.
3. Performance: React uses these keys to optimize rendering. It can quickly determine which items in a list have changed, been added, or been removed.
4. State Preservation: If your list items have state or are controlled inputs, proper keys help React maintain the correct state for each item.
5. Avoiding Warnings: React will give you a warning in the console if you don't provide keys for list items.
 */
export default function ProductsList({products}: { products: Product[] }) {

    return (
        // clicking each product should go to the /product-detail page for that product
        // avoid using <a> anchor tag, it causes a full page reload. This negates the benefits of a single-page application(SPA) architecture that Next.js provides
        // Problem with Full Page Reload: All your react component states are lost, which can lead to poor user experience, specially if you have any form inputs or complex UI states.
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* v1: Original product mapping */}
                {/* v2: Added onClick to demonstrate state logging before navigation */}
                {products.map((product,index) => (
                    <div key={`${product.id}-${index}`}>
                        {renderAProduct(product,index)}
                    </div>
                ))}
            </div>
        </div>
    )
}