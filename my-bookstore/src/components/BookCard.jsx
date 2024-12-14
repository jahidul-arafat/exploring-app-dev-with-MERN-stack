import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
export default function BookCard({ book }) {
    const { addToCart } = useCart();

    return (
        <div style={{
            border: '1px solid #ddd',
            padding: '10px',
            borderRadius: '8px',
            width: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {/* eslint-disable-next-line react/prop-types */}
            <img src={book.image} alt={book.title} style={{ width: '100px', marginBottom: '10px' }} />
            {/* eslint-disable-next-line react/prop-types */}
            <h2 style={{ fontSize: '1.1em', marginBottom: '0.5em', textAlign: 'center' }}>{book.title}</h2>
            {/* eslint-disable-next-line react/prop-types */}
            <p style={{ margin: '0.5em 0' }}><strong>Author:</strong> {book.author}</p>
            {/* eslint-disable-next-line react/prop-types */}
            <p style={{ margin: '0.5em 0' }}><strong>Price:</strong> ${book.price.toFixed(2)}</p>
            {/* eslint-disable-next-line react/prop-types */}
            <Link to={`/book/${book.id}`} style={{ marginBottom: '10px', textDecoration: 'underline', color: 'blue' }}>View Details</Link>
            <button onClick={() => addToCart(book)} style={{ padding: '5px 10px' }}>Add to Cart</button>
        </div>
    );
}
