import {Product, products} from "@/app/data/product-data";
// Define function for different HTTP methods
// This will not send back to cleint any react component, instead data just like API
// thats why we named it route.ts, not route.tsx

// GET request, return a Response()
export async function GET() {
    try {
        // return the products data as JSON
        return new Response(
            JSON.stringify(products),
            {
                headers: {'Content-Type': 'application/json'},
                status: 200,
            });
    } catch (error) {
        console.error("Error fetching products: ", error);
        return new Response(
            JSON.stringify({error: 'Internal Server Error'}),
            {
                headers: {'Content-Type': 'application/json'},
                status: 400,
            });
    }


    //the frontend will make a GET request to load the products or products in user shopping cart
    // return what server wants to send back to client
    //return new Response('Hello from Next.js route handler!!');
}

export async function POST(request: Request) {
    try {
        // parse the request body
        const newProduct: Product = await request.json();

        // validate the new product
        if (!newProduct.id || !newProduct.name || !newProduct.imageUrl || !newProduct.description || !newProduct.price) {
            return new Response(
                JSON.stringify({error: 'Invalid Product Data'}),
                {
                    headers: {'Content-Type': 'application/json'},
                    status: 400,
                });
        }

        // if newProduct is OK, then add this to the products array
        products.push(newProduct);

        // return the newly added product
        return new Response(
            JSON.stringify(newProduct),
            {
                headers: {'Content-Type': 'application/json'},
                status: 201,
            }
        );
    } catch (error) {
        console.error("Error adding new product: ", error);
        return new Response(
            JSON.stringify({error: 'Internal Server Error'}),
            {
                headers: {'Content-Type': 'application/json'},
                status: 500,
            });
    }

}


// DELETE request, return a Response()
// http://localhost:3000/api/products?id=<product_id>
export async function DELETE(request: Request) {
    try {
        // Parse the product ID from the request URL
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return new Response(
                JSON.stringify({error: 'Product ID is required'}),
                {
                    headers: {'Content-Type': 'application/json'},
                    status: 400,
                }
            );
        }

        // Find the index of the product with the given ID
        const productIndex = products.findIndex(p => p.id === id);

        if (productIndex === -1) { // means product not found
            return new Response(
                JSON.stringify({error: 'Product not found'}),
                {
                    headers: {'Content-Type': 'application/json'},
                    status: 404,
                }
            );
        }

        // Remove the product from the array
        const deletedProduct = products.splice(productIndex, 1)[0];

        // Return the deleted product
        return new Response(
            JSON.stringify(deletedProduct),
            {
                headers: {'Content-Type': 'application/json'},
                status: 200,
            }
        );
    } catch (error) {
        console.error("Error deleting product: ", error);
        return new Response(
            JSON.stringify({error: 'Internal Server Error'}),
            {
                headers: {'Content-Type': 'application/json'},
                status: 500,
            }
        );
    }
}

// PUT method to modify a product
// http://localhost:3000/api/products?id=<product_id>
export async function PUT(request: Request) {
    try {
        // Parse the product ID from the request URL
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return new Response(
                JSON.stringify({error: 'Product ID is required'}),
                {
                    headers: {'Content-Type': 'application/json'},
                    status: 400,
                }
            );
        }

        // Parse the updated product data from the request body
        /*
        With Partial<Product>, a valid update request could look like this:
        {
            "price": 29.99,
            "description": "Updated description"
        }
         */
        const updatedProduct: Partial<Product> = await request.json();

        // Find the index of the product with the given ID
        const productIndex = products.findIndex(p => p.id === id);

        if (productIndex === -1) { // means product not found
            return new Response(
                JSON.stringify({error: 'Product not found'}),
                {
                    headers: {'Content-Type': 'application/json'},
                    status: 404,
                }
            );
        }

        // Update the product
        /*
        This line is using the spread operator (...) to create a new object that updates the existing product with the new data. Here's what's happening:
        1. ...products[productIndex]: This spreads all the properties of the existing product into the new object. It's like creating a copy of the original product.
        2. ...updatedProduct: This spreads all the properties from the updatedProduct object (which contains the updates sent in the PUT request) into the new object. If there are any properties in updatedProduct that also exist in the original product, they will overwrite the original values.
        3. id: id: This explicitly sets the id property to the original id. This is done to ensure that even if the updatedProduct included an id field, it won't change the product's ID.
         */
        products[productIndex] = {
            ...products[productIndex],
            ...updatedProduct,
            id: id // Ensure the ID doesn't change
        };

        // Return the updated product
        return new Response(
            JSON.stringify(products[productIndex]),
            {
                headers: {'Content-Type': 'application/json'},
                status: 200,
            }
        );
    } catch (error) {
        console.error("Error updating product: ", error);
        return new Response(
            JSON.stringify({error: 'Internal Server Error'}),
            {
                headers: {'Content-Type': 'application/json'},
                status: 500,
            }
        );
    }
}





