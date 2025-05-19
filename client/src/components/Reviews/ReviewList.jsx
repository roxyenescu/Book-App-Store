import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReviewList = ({ bookId, refreshFlag }) => {
    const [reviews, setReviews] = useState(null);

    useEffect(() => {
        const loadReviews = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:1000/api/v1/get-reviews/${bookId}`
                );
                setReviews(response.data.data);
            } catch (err) {
                console.error('Failed to fetch reviews:', err);
                setReviews([]);
            }
        };

        loadReviews();
    }, [bookId, refreshFlag]);

    if (!reviews) {
        return <p className="mt-4 text-zinc-400">Loading reviews...</p>;
    }
    if (reviews.length === 0) {
        return <p className="mt-4 text-zinc-400">There are no reviews yet.</p>;
    }

    return (
        <div className="mt-8 space-y-4">
            <h4 className="text-3xl text-yellow-100">
                Reviews from customers who bought the book 
            </h4>
            {reviews.map(r => (
                <div key={r._id} className="p-4 bg-zinc-800 rounded">
                    <div className="flex items-center mb-1">
                        <img
                            src={r.user.avatar}
                            alt={r.user.username}
                            className="h-8 w-8 rounded-full mr-2"
                        />
                        <strong className="text-zinc-200">{r.user.username}</strong>
                        <span className="ml-auto text-yellow-300">
                            {'★'.repeat(r.rating)}
                            {'☆'.repeat(5 - r.rating)}
                        </span>
                    </div>
                    {r.comment && <p className="text-zinc-400">{r.comment}</p>}
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
