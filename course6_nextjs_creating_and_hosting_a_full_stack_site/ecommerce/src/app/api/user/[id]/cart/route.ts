import {NextRequest, NextResponse} from "next/server";
import {products} from "@/app/data/product-data";

// The code is trying to use localStorage, which is not available in a server-side environment like a Next.js API route.
// localStorage is a browser-specific API and cannot be accessed on the server.
// Mock cart data
type ShoppingCart = Record<string, string[]>;
const mockCarts: ShoppingCart = {
    'user1': ['111', '123'],
    'user2': ['345', '456'],
    'user3': ['345', '45610'],
};

type Params = {
    id: string,
}

// why GET signature for API route is async?
// Consistency with Next.js API Routes: Next.js recommends using async functions for API routes. This ensures compatibility with Next.js's handling of API requests and allows for easier integration of asynchronous operations in the future.
// TypeScript often expects API route handlers to be async functions, especially when used with frameworks like Next.js.
// GET http://localhost:3000/api/user/[id]/cart
export async function GET(request: NextRequest, {params}: { params: Params }) {
    const userId = params.id;
    // check if user exists in mock data
    if (!mockCarts[userId]) {
        return NextResponse.json({error: "User not found"}, {
            status: 404,
            headers: {'Content-Type': 'application/json'},
        });
    }

    // Log the request and the user's ID
    console.log(`GET request received at /api/user/${userId}/cart`);

    try {
        // Fetch cart items from mock data
        const cartItems = mockCarts[userId] || [];

        // Find the corresponding products
        const validCartProducts = cartItems.map((id: string) =>
            products.find(product => product.id === id)
        ).filter(Boolean);

        // Return the cart products
        return NextResponse.json(validCartProducts, {
            status: 200,
            headers: {'Content-Type': 'application/json'}
        });
    } catch (error) {
        console.error("Error fetching cart items:", error);
        return NextResponse.json({error: "Failed to fetch cart items"}, {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    }
}