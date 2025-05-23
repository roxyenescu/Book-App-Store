import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import BookCard from '../BookCard/BookCard';

const ReviewedBookRecommendations = ({ bookId, refreshFlag }) => {
    const [recs, setRecs] = useState(null);
    const isLoggedIn = useSelector(s => s.auth.isLoggedIn);
    const role = useSelector(s => s.auth.role);

    const headers = {
        id: localStorage.getItem('id'),
        authorization: `Bearer ${localStorage.getItem('token')}`,
    };

    useEffect(() => {
        if (!isLoggedIn || role !== 'user') return;

        const load = async () => {
            const response = await axios.get(
                `http://localhost:1000/api/v1/recommend-by-review/${bookId}`,
                { headers }
            );
            setRecs(response.data.data);
        };
        load();
    }, [bookId, isLoggedIn, role, refreshFlag]);

    if (!recs || recs.length === 0) return null;

    return (
        <div className="mt-12 px-4">
            <h4 className="text-3xl text-yellow-100 mb-4">
                Because you liked this book so much, we also recommend:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {recs.map(b => (
                    <BookCard key={b._id} data={b} />
                ))}
            </div>
        </div>
    );
};

export default ReviewedBookRecommendations;