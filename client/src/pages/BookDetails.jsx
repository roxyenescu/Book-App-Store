import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ViewBookDetails from '../components/ViewBookDetails/ViewBookDetails';
import ReviewForm from '../components/Reviews/ReviewForm';
import ReviewList from '../components/Reviews/ReviewList';
import ReviewedBookRecommendations from '../components/Reviews/ReviewedBookRecommendations';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BookDetails = () => {
    const { id: bookId } = useParams();

    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const role = useSelector(state => state.auth.role);

    const [hasPurchased, setHasPurchased] = useState(false);
    const [newReviewFlag, setNewReviewFlag] = useState(false);

    const headers = {
        id: localStorage.getItem('id'),
        authorization: `Bearer ${localStorage.getItem('token')}`
    };

    useEffect(() => {
        if (!isLoggedIn || role !== 'user') return;

        const fetch = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:1000/api/v1/get-order-history',
                    { headers }
                );
                const bought = response.data.data.some(o => o.book._id === bookId);
                setHasPurchased(bought);
            } catch (err) {
                console.error(err);
            }
        };
        fetch();
    }, [bookId, isLoggedIn, role]);

    const handleNewReview = () => {
        setNewReviewFlag(f => !f);
    };

    return (
        <div className="bg-zinc-900 min-h-screen pb-12">
            <ViewBookDetails />

            <div className="px-4 md:px-12 mt-12">
                {isLoggedIn && role === 'user' && hasPurchased && (
                    <>
                        <ReviewForm
                            bookId={bookId}
                            onReview={handleNewReview}
                        />
                        <ReviewedBookRecommendations
                            bookId={bookId}
                            refreshFlag={newReviewFlag}
                        />
                    </>
                )}

                <ReviewList
                    bookId={bookId}
                    refreshFlag={newReviewFlag}
                />
            </div>
        </div>
    );
};

export default BookDetails;