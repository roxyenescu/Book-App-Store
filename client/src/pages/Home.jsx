import React from 'react';
import Hero from '../components/Home/Hero'
import RecentlyAdded from '../components/Home/RecentlyAdded';
import RecommendedBoth from '../components/Home/RecommendedBoth';
import RecommendedByAuthor from '../components/Home/RecommendedByAuthor';

const Home = () => {
  return (
    <div className="bg-zinc-900 text-white px-10 py-8">
      <Hero />
      <RecentlyAdded />
      <RecommendedBoth />
      <RecommendedByAuthor />
    </div>
  )
}

export default Home
