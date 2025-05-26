import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from '../BookCard/BookCard';
import Loader from '../Loader/Loader';

const MostPurchasedThisWeek = () => {
    const [Data, setData] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const response = await axios.get(
                'http://localhost:1000/api/v1/most-purchased-this-week'
            );
            setData(response.data.data);
        };
        fetch();
    }, []);

    if (Data.length === 0) {
        return null;
    }

    return (
        <div className="mt-8 px-4">
            <h4 className="text-3xl text-yellow-100">Most Purchased This Week</h4>

            {!Data.length && (
                <div className="flex items-center justify-center my-8">
                    <Loader />
                </div>
            )}

            {/* DESKTOP */}
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 my-8">
                {Data.map((items, i) => (
                    <div key={i}>
                        <BookCard data={items} />
                    </div>
                ))}
            </div>

            {/* MOBILE */}
            <div className="flex sm:hidden gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory my-8">
                {Data.map((item, i) => (
                    <div
                        key={item._id || i}
                        className="flex-shrink-0 w-full snap-start"
                    >
                        <BookCard data={item} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MostPurchasedThisWeek;
