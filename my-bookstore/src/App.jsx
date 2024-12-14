import { Routes, Route } from 'react-router-dom';
import BooksPage from './pages/BooksPage';
import BookDetailsPage from './pages/BookDetailsPage';
import CartPage from './pages/CartPage';
import Header from './components/Header';

export default function App() {
    return (
        <div style={{ fontFamily: 'sans-serif' }}>
            <Header />
            <Routes>
                <Route path="/" element={<BooksPage />} />
                <Route path="/book/:id" element={<BookDetailsPage />} />
                <Route path="/cart" element={<CartPage />} />
            </Routes>
        </div>
    );
}
