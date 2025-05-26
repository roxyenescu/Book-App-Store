import React from 'react';
import Hero from '../components/Home/Hero'
import RecentlyAdded from '../components/Home/RecentlyAdded';
import HotThisWeek from '../components/Home/HotThisWeek';
import MostPurchasedThisWeek from '../components/Home/MostPurchasedThisWeek';
import OriginalPicks from '../components/Home/OriginalPicks';
import LaughOutLoudReads from '../components/Home/LaughOutLoudReads';
import DialogueHeavyDramas from '../components/Home/DialogueHeavyDramas';

const Home = () => {
  return (
    <div className="bg-zinc-900 text-white px-10 py-8">
      <Hero />
      <RecentlyAdded />
      <HotThisWeek />
      <MostPurchasedThisWeek />
      <OriginalPicks />
      <LaughOutLoudReads />
      <DialogueHeavyDramas />
    </div>
  )
}

export default Home
