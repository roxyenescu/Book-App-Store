import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from '../BookCard/BookCard';
import Loader from '../Loader/Loader';

const MostPurchasedThisWeek = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await axios.get(
                    'http://localhost:1000/api/v1/most-purchased-this-week'
                );
                setBooks(data.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetch();
    }, []);

    return (
        <div className="mt-8 px-4">
            <h4 className="text-3xl text-yellow-100">Most Purchased This Week</h4>

            {!books.length && (
                <div className="flex items-center justify-center my-8">
                    <Loader />
                </div>
            )}

            {/* DESKTOP */}
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 my-8">
                {books.map((book, i) => (
                    <div key={book._id || i}>
                        <BookCard data={book} />
                    </div>
                ))}
            </div>

            {/* MOBILE */}
            <div className="flex sm:hidden gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory my-8">
                {books.map((book, i) => (
                    <div
                        key={book._id || i}
                        className="flex-shrink-0 w-full snap-start"
                    >
                        <BookCard data={book} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MostPurchasedThisWeek;
