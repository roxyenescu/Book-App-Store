import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import BookCard from '../../BookCard/BookCard';

const ForYouRecommendations = () => {
  const isLoggedIn = useSelector(s => s.auth.isLoggedIn);
  const role = useSelector(s => s.auth.role);
  const [blocks, setBlocks] = useState(null);

  const headers = {
    id: localStorage.getItem('id'),
    authorization: `Bearer ${localStorage.getItem('token')}`
  };

  useEffect(() => {
    if (!isLoggedIn || role !== 'user') return;

    const load = async () => {
      const response = await axios.get(
        'http://localhost:1000/api/v1/recommend-for-you',
        { headers }
      );
      setBlocks(response.data.data);
    };
    load();
  }, [isLoggedIn, role]);

  if (!blocks) return null;

  return (
    <div className="space-y-12">
      {Object.entries(blocks).map(([key, { label, books }]) => (
        books.length > 0 && (
          <div key={key}>
            <h3 className="text-2xl text-yellow-100 mb-4">{label}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {books.map(b => <BookCard key={b._id} data={b} />)}
            </div>
          </div>
        )
      ))}
    </div>
  );
}

export default ForYouRecommendations
