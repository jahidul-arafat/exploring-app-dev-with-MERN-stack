import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartPage() {
    const { cartItems, removeFromCart } = useCart();

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty. <Link to="/" style={{ textDecoration: 'underline', color: 'blue' }}>Go back to shop</Link></p>
            ) : (
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
                    {cartItems.map(item => (
                        <div key={item.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px', width: '200px' }}>
                            <h3 style={{ fontSize: '1.1em', marginBottom: '0.5em' }}>{item.title}</h3>
                            <p><strong>Author:</strong> {item.author}</p>
                            <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
                            <button onClick={() => removeFromCart(item.id)} style={{ padding: '5px 10px' }}>Remove</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
