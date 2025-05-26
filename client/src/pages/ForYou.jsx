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
            <h1 className="text-4xl text-yellow-200 font-semibold mb-8">
                Based on your favourite list
            </h1>
            <RecommendedBoth />
            <RecommendedByGenre />
            <RecommendedByAuthor />

            <h1 className="text-4xl text-yellow-200 font-semibold mb-8">
                Based on your general positive sentiment reviews
            </h1>
            <PositiveRecommendations />

            <h1 className="text-4xl text-yellow-200 font-semibold mb-8">
                Based on your reviews
            </h1>
            <ForYouRecommendations />
        </div>
    );
};

export default ForYou;
