import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Loader from '../components/Loader/Loader';
import BookCard from '../components/BookCard/BookCard';
import SearchBar from '../components/SearchBar/SearchBar';

const AllBooks = () => {
  const [Data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "http://localhost:1000/api/v1/get-all-books"
      );
      setData(response.data.data);
    };
    fetch();
  }, []);

  const genres = useMemo(() => {
    const all = Data.flatMap(b => b.genre || []);
    return ['all', ...Array.from(new Set(all))];
  }, [Data]);

  const filteredData = useMemo(() => {
    let temp = Data;

    if (search.trim()) {
      const term = search.toLowerCase();
      temp = temp.filter(b =>
        b.title.toLowerCase().includes(term) ||
        b.author.toLowerCase().includes(term)
      );
    }

    if (genreFilter !== 'all') {
      temp = temp.filter(b => (b.genre || []).includes(genreFilter));
    }

    temp = [...temp].sort((a, b) =>
      sortOrder === 'asc' ? a.price - b.price : b.price - a.price
    );

    return temp;
  }, [Data, search, genreFilter, sortOrder]);

  if (!Data.length) {
    return (
      <div className="flex-1 bg-zinc-900 px-12 py-8">
        <h4 className="text-3xl text-yellow-100">All books</h4>
        <div className="w-full flex items-center justify-center mt-8">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-zinc-900 px-12 py-8">
      <h4 className="text-3xl text-yellow-100 mb-4">All books</h4>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <SearchBar
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by title or author..."
          className="w-full md:flex-1"
        />

        <select
          value={genreFilter}
          onChange={e => setGenreFilter(e.target.value)}
          className="w-full md:w-1/4 bg-zinc-800 text-zinc-200 p-2 rounded"
        >
          {genres.map(g => (
            <option key={g} value={g}>
              {g === 'all' ? 'All Genres' : g.charAt(0).toUpperCase() + g.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
          className="w-full md:w-1/4 bg-zinc-800 text-zinc-200 p-2 rounded"
        >
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {filteredData.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {filteredData.map((b, i) => (
            <BookCard key={b._id || i} data={b} />
          ))}
        </div>
      ) : (
        <p className="text-zinc-400">No books match your filters.</p>
      )}
    </div>
  );
};

export default AllBooks;
