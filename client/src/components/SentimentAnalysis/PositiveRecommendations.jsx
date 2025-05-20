import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import BookCard from '../BookCard/BookCard';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

const PositiveRecommendations = () => {
    const isLoggedIn = useSelector(s => s.auth.isLoggedIn);
    const role = useSelector(s => s.auth.role);

    const [data, setData] = useState(null);
    const sliderRef = useRef();

    const headers = {
        id: localStorage.getItem('id'),
        authorization: `Bearer ${localStorage.getItem('token')}`
    };

    useEffect(() => {
        if (!isLoggedIn || role !== 'user') return;

        const load = async () => {
            const response = await axios.get(
                'http://localhost:1000/api/v1/recommend-from-sentiment',
                { headers }
            );
            setData(response.data.data);
        };
        load();
    }, [isLoggedIn, role]);

    if (
        !isLoggedIn ||
        role !== 'user' ||
        !data ||
        !Array.isArray(data.recs) ||
        data.recs.length === 0
    ) {
        return null;
    }

    const recs = data.recs.slice(0, 8);
    const pageWidth = () => sliderRef.current?.offsetWidth || 0;
    const scrollNext = () => {
        sliderRef.current.scrollBy({
            left: pageWidth(),
            behavior: 'smooth'
        });
    };
    const scrollPrev = () => {
        sliderRef.current.scrollBy({
            left: -pageWidth(),
            behavior: 'smooth'
        });
    };

    return (
        <div className="mt-12 px-4 relative">
            <h4 className="text-3xl text-yellow-100 mb-4">
                Based on your positive reviews, we also recommend:
            </h4>

            <button
                onClick={scrollPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-yellow-500 hover:bg-yellow-600 p-2 rounded-full z-10"
            >
                <FaChevronLeft size={20} className="text-zinc-900" />
            </button>

            <div className="overflow-hidden">
                <div
                    ref={sliderRef}
                    className="flex space-x-4 overflow-x-auto scrollbar-hidden snap-x snap-mandatory"
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    {recs.map(b => (
                        <div key={b._id} className="snap-start flex-shrink-0 w-1/4">
                            <BookCard data={b} />
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={scrollNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-yellow-500 hover:bg-yellow-600 p-2 rounded-full z-10"
            >
                <FaChevronRight size={20} className="text-zinc-900" />
            </button>
        </div>
    )
}

export default PositiveRecommendations
