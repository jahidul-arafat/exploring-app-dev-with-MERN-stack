// This context will store cart items, and provide addToCart and removeFromCart functions to be used by any component.
import { createContext, useState, useContext } from 'react';

const CartContext = createContext();

// eslint-disable-next-line react/prop-types
export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    function addToCart(book) {
        // Check if the book is already in the cart
        const exists = cartItems.find(item => item.id === book.id);
        if (exists) {
            // If it exists, you could update quantity if you manage quantity,
            // but for simplicity, let's just not add duplicates.
            return;
        } else {
            setCartItems([...cartItems, book]);
        }
    }

    function removeFromCart(id) {
        setCartItems(cartItems.filter(item => item.id !== id));
    }

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
