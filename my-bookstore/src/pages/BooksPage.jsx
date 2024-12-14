import { useState } from 'react';
import { booksData } from '../data';
import BookCard from '../components/BookCard';

export default function BooksPage() {
    const [books] = useState(booksData);

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Available Books</h2>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
                {books.map(book => <BookCard key={book.id} book={book} />)}
            </div>
        </div>
    );
}
