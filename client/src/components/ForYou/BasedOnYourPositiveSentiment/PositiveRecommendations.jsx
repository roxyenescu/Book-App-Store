import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import BookCard from '../../BookCard/BookCard';
import Loader from '../../Loader/Loader';

const PositiveRecommendations = () => {
    const isLoggedIn = useSelector(s => s.auth.isLoggedIn);
    const role = useSelector(s => s.auth.role);

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const headers = {
        id: localStorage.getItem('id'),
        authorization: `Bearer ${localStorage.getItem('token')}`
    };

    useEffect(() => {
        if (!isLoggedIn || role !== 'user') return;

        const fetchRecs = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:1000/api/v1/recommend-from-sentiment',
                    { headers }
                );
                const recs = response.data.data.recs || [];
                setBooks(recs.slice(0, 4));
            } catch (err) {
                console.error(err);
                setError('Unable to load sentiment-based recommendations.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecs();
    }, [isLoggedIn, role]);

    if (!isLoggedIn || role !== 'user') return null;
    if (loading && !error) return <Loader />;
    if (error || books.length === 0) return null;

    return (
        <div className="mt-12 px-4">
            <h4 className="text-3xl text-yellow-100 mb-4">
                Based on your positive reviews, we also recommend:
            </h4>
            <div className="my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {books.map((b, i) => (
                    <BookCard key={b._id || i} data={b} />
                ))}
            </div>
        </div>
    );
};

export default PositiveRecommendations;
