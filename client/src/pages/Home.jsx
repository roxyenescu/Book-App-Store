import React from 'react';
import Hero from '../components/Home/Hero'
import RecentlyAdded from '../components/Home/RecentlyAdded';
import RecommendedBoth from '../components/Home/RecommendedBoth';
import RecommendedByGenre from '../components/Home/RecommendedByGenre';
import RecommendedByAuthor from '../components/Home/RecommendedByAuthor';
import PositiveRecommendations from '../components/SentimentAnalysis/PositiveRecommendations';

const Home = () => {
  return (
    <div className="bg-zinc-900 text-white px-10 py-8">
      <Hero />
      <RecentlyAdded />
      <RecommendedBoth />
      <RecommendedByGenre />
      <RecommendedByAuthor />
      <PositiveRecommendations />
    </div>
  )
}

export default Home
