import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Header() {
    const { cartItems } = useCart();

    return (
        <header style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
            <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <h1 style={{ marginRight: 'auto' }}>My Bookstore</h1>
                <Link to="/">Home</Link>
                <Link to="/cart">Cart ({cartItems.length})</Link>
            </nav>
        </header>
    );
}
