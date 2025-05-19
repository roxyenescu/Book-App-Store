import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ bookId, onReview }) => {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const headers = {
    id: localStorage.getItem('id'),
    authorization: `Bearer ${localStorage.getItem('token')}`,
  };

  const submit = async () => {
    setLoading(true);
    try {
      await axios.post(
        'http://localhost:1000/api/v1/add-review',
        { bookId, rating, comment },
        { headers }
      );
      setComment('');
      onReview();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 p-4 bg-zinc-800 rounded">
      <h4 className="text-xl text-yellow-100 mb-2">Leave a review</h4>
      <div className="flex mb-3">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            className={`text-3xl px-1 focus:outline-none ${n <= rating
                ? 'text-yellow-300'
                : 'text-zinc-500'
              }`}
          >
            {n <= rating ? '★' : '☆'}
          </button>
        ))}
      </div>
      <textarea
        rows="3"
        className="w-full p-2 bg-zinc-900 text-white rounded mb-2"
        placeholder="Comment (optional)…"
        value={comment}
        onChange={e => setComment(e.target.value)}
      />
      <button
        onClick={submit}
        disabled={loading}
        className="px-4 py-2 bg-yellow-500 rounded hover:bg-yellow-600 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Submit the review'}
      </button>
    </div>
  );
};

export default ReviewForm;
