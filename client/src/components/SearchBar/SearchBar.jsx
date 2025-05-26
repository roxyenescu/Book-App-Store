import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ value, onChange, placeholder }) => (
    <div className={`relative ${className}`}>
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500" />
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-2 rounded-lg border 
                     border-zinc-700 bg-zinc-800 text-zinc-100
                     placeholder-zinc-500 
                       focus:outline-none focus:ring-2 focus:ring-yellow-300"
        />
    </div>
);

export default SearchBar;
