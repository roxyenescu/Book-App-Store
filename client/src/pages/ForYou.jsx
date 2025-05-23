import React from 'react';
import { useSelector } from 'react-redux';
import ForYouRecommendations from '../components/SentimentAnalysis/ForYouRecommendations';

const ForYou = () => {
    const isLoggedIn = useSelector(s => s.auth.isLoggedIn);
    const role = useSelector(s => s.auth.role);

    if (!isLoggedIn || role !== 'user') return null;

    return (
        <div className="bg-zinc-900 text-white px-4 py-8">
            <h1 className="text-4xl text-yellow-200 font-semibold mb-8">
                Based on your reviews
            </h1>
            <ForYouRecommendations />
        </div>
    );
};

export default ForYou;
