"use client"

import React, {useState, useEffect} from 'react';
import {useSearchParams} from 'next/navigation';
import {Product, products} from "@/app/data/product-data";
import Link from 'next/link';

// Mock api implementation details
// step-1: define an interface for payment data
interface PaymentData {
    items: Product[];
    email: string;
    paymentMethod: string;
    totalPrice: number;
}

// Mock function to simulate payment processing
const mockProcessPayment = async (paymentData: PaymentData): Promise<{ success: boolean, transactionId: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate a successful payment 90% of the time
    if (Math.random() < 0.9) {
        return {
            success: true,
            transactionId: 'mock-' + paymentData.email.split("@")[0] + "-" + Math.random().toString(36).substr(2, 9)
        };
    } else {
        throw new Error('Payment failed');
    }
};

// Checkout component
export default function CheckoutPage() {
    const searchParams = useSearchParams();
    console.log("Search Param: ", searchParams.get('items'));

    // 3x useState hooks to observer the current state of the react components
    /*
    * Note- we not gonna use useEffect() for email and payment method state changes
    * why?
    * The reason we didn't use useEffect() for the email and paymentMethod states is that these are form input fields that don't depend on external data or side effects.
    * Let me explain:
    * 1. cartItems: We use useEffect() for this because it depends on the URL parameters (external data).
    * We need to parse the URL, find the corresponding products, and
    * update the state when the component mounts or when the URL changes.
    *
    * 2. email and paymentMethod: These are controlled form inputs.
    * Their values are meant to be changed directly by user interaction (typing in the email field or selecting a payment method).
    * They don't need to be initialized from any external source or updated based on side effects.
    * */
    const [cartItems, setCartItems] = useState<Product[]>([]); // current state of the component i.e. current cart items and changes in the cart items; default null
    const [email, setEmail] = useState('jahidapon@gmail.com');
    const [paymentMethod, setPaymentMethod] = useState('');

    // execute only when there is a change in the cart items
    // http://localhost:3000/checkout?items=123,345 if the items changes here, only then execute this sideEffect function
    useEffect(() => {
        const cartItemIds = searchParams.get('items')?.split(',') || []; // http://localhost:3000/checkout?items=123,345
        const items = cartItemIds
            .map(id => products.find(p => p.id === id))
            .filter((product) => product !== undefined);
        setCartItems(items);
    }, [searchParams]);

    // calculate the total cost of all cart items
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
    console.log("Total Price: ", totalPrice);

    // upon successful payment, an alert will appear in the browser that the payment is done
    /*
    1. (e: React.FormEvent) => { ... }: This is the function definition. It takes an event (e) of type React.FormEvent as its parameter. This event is automatically passed when the form is submitted.
    2. .preventDefault();: This prevents the default form submission behavior, which would cause the page to reload. Instead, we want to handle the submission in JavaScript.
     Normally, when a form is submitted, the browser will reload the page or navigate to a new URL. This is the default behavior that event.preventDefault() is meant to stop.
     */
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // simulating the necessity of event.preventDefault(), when where your checkout process involves sending data to a backend API and waiting for a response before proceeding.
        // In this case, using event.preventDefault() becomes crucial.

        /*
        1.  event.preventDefault() is crucial because:
            - It prevents the form from submitting and reloading the page while we're waiting for the API response.
            - It allows us to handle the asynchronous operation (API call) without interruption.
        2. We're making an asynchronous call to a hypothetical /api/process-payment endpoint.
        3. We're waiting for the response from the server before proceeding.
        4. If the payment is successful, we show an alert with the transaction details.
        5.  If there's an error, we catch it and show an error message to the user.
         */
        // Simulate sending data to backend and waiting for response
        // const response = await fetch('/api/process-payment', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         items: cartItems,
        //         email: email,
        //         paymentMethod: paymentMethod,
        //         totalPrice: totalPrice
        //     }),
        // });
        //
        // if (!response.ok) {
        //     throw new Error('Payment failed');
        // }

        // const result = await response.json();

        // Check if the total price is 0
        if (cartItems.length === 0 || totalPrice === 0) {
            alert("Invalid order: The total price is $0. Please add items to your cart before checking out.");
            return; // Exit the function early
        }

        try {
            // Use the mock payment process instead of actual fetch
            const result = await mockProcessPayment({
                items: cartItems,
                email: email,
                paymentMethod: paymentMethod,
                totalPrice: totalPrice
            });

            if (!result.success) {
                console.error("Payment processing failed");
                alert('There was an error processing your payment. Please try again.');
                return; // Exit the function early
            }

            // Handle successful payment
            const date = new Date().toLocaleDateString();
            const itemNames = cartItems.map(item => item.name).join(', ');

            alert(`Payment for items ${itemNames} is done on ${date} for $${totalPrice.toFixed(2)}. Transaction ID: ${result.transactionId}. An email confirmation has been sent to ${email}.`);
            // You might want to clear the cart or redirect the user here

        } catch (error) {
            console.error("Error during payment processing:", error);
            alert('An unexpected error occurred. Please try again later.');
        }

    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
                    {cartItems.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="flex justify-between items-center mb-2">
                            <span>{item.name}</span>
                            <span>${item.price.toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between items-center font-bold">
                            <span>Total</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block mb-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div>
                            <label htmlFor="payment" className="block mb-1">Payment Method</label>
                            <select
                                id="payment"
                                value={paymentMethod}
                                onChange={(event) => setPaymentMethod(event.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded"
                            >
                                <option value="">Select a payment method</option>
                                <option value="credit">Credit Card</option>
                                <option value="paypal">PayPal</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className={`w-full py-2 px-4 rounded ${
                                cartItems.length === 0 || totalPrice === 0
                                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                            disabled={cartItems.length === 0 || totalPrice === 0}
                        >
                            Complete Purchase
                        </button>
                    </form>
                </div>
            </div>

            <div className="mt-8">
                <Link href="/cart" className="text-blue-600 hover:underline">
                    ← Back to Cart
                </Link>
            </div>
        </div>
    );
}