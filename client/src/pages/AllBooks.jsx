import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader/Loader';
import BookCard from '../components/BookCard/BookCard';
import SearchBar from '../components/SearchBar/SearchBar';

const AllBooks = () => {
  const [Data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "http://localhost:1000/api/v1/get-all-books"
      );
      setData(response.data.data);
      setFilteredData(response.data.data);
    };
    fetch();
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    setFilteredData(
      Data.filter(items =>
        items.title.toLowerCase().includes(term) ||
        items.author.toLowerCase().includes(term)
      )
    );
  }, [search, Data]);

  return (
    <div className='flex-1 bg-zinc-900 px-12 py-8'>
      <h4 className='text-3xl text-yellow-100'>All books</h4>

      <div className="flex justify-center mb-8">
        <SearchBar
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by title or author..."
          className="w-full max-w-2xl"
        />
      </div>

      {!Data.length ? (
        <div className="w-full flex-1 flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {filteredData.map((items, i) => (
            <div key={i}>
              <BookCard data={items} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AllBooks
