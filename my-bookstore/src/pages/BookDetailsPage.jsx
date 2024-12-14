import { useParams, Link } from 'react-router-dom';
import { booksData } from '../data';
import { useCart } from '../context/CartContext';

export default function BookDetailsPage() {
    const { id } = useParams();
    const { addToCart } = useCart();

    const book = booksData.find(b => b.id === parseInt(id));
    if (!book) {
        return <div style={{ padding: '20px' }}>Book not found.</div>;
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <Link to="/" style={{ textDecoration: 'underline', color: 'blue' }}>Back to Home</Link>
            <h2>{book.title}</h2>
            <img src={book.image} alt={book.title} style={{ width: '150px', margin: '10px 0' }} />
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Price:</strong> ${book.price.toFixed(2)}</p>
            <p><strong>Description:</strong> {book.description}</p>
            <button onClick={() => addToCart(book)} style={{ padding: '5px 10px', marginTop: '10px' }}>Add to Cart</button>
        </div>
    );
}
