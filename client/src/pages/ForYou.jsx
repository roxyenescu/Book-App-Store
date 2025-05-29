import React from 'react';
import { useSelector } from 'react-redux';
import RecommendedBoth from '../components/ForYou/BasedOnFavouriteList/RecommendedBoth';
import RecommendedByGenre from '../components/ForYou/BasedOnFavouriteList/RecommendedByGenre';
import RecommendedByAuthor from '../components/ForYou/BasedOnFavouriteList/RecommendedByAuthor';
import PositiveRecommendations from '../components/ForYou/BasedOnYourPositiveSentiment/PositiveRecommendations';
import ForYouRecommendations from '../components/ForYou/BasedOnAspectsAnalysis/ForYouRecommendations';

const ForYou = () => {
    const isLoggedIn = useSelector(s => s.auth.isLoggedIn);
    const role = useSelector(s => s.auth.role);

    if (!isLoggedIn || role !== 'user') return null;

    return (
        <div className="bg-zinc-900 text-white px-4 py-8">
            <div className='mb-10'>
                <h1 className="text-4xl text-yellow-200 font-semibold mb-4">
                    Based on your favourite list
                </h1>
                <p className='text-zinc-500 italic'>
                    Add some books to your favourites so we can suggest titles that match your preferred authors and genres.
                </p>
                <RecommendedBoth />
                <RecommendedByGenre />
                <RecommendedByAuthor />
            </div>

            <div className='mb-10'>
                <h1 className="text-4xl text-yellow-200 font-semibold mb-4">
                    Based on your general positive sentiment reviews
                </h1>
                <p className='text-zinc-500 italic'>
                    Leave positive reviews for the books you love to get recommendations tailored to your taste.
                </p>
                <PositiveRecommendations />
            </div>

            <div className='rounded mb-8'>
                <h1 className="text-4xl text-yellow-200 font-semibold mb-4">
                    Based on your reviews
                </h1>
                <p className='text-zinc-500 italic'>
                    Write detailed reviews of the books you’ve read to unlock personalized suggestions.
                </p>
                <ForYouRecommendations />
            </div>
        </div>
    );
};

export default ForYou;
