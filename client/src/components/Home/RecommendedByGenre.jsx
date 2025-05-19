import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import BookCard from '../BookCard/BookCard';
import Loader from '../Loader/Loader';

const RecommendedByGenre = () => {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const role = useSelector(state => state.auth.role);

    const [books, setBooks] = useState(null);
    const [topGenre, setTopGenre] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isLoggedIn || role !== 'user') return;

        const fetchByGenre = async () => {
            try {
                const headers = {
                    id: localStorage.getItem("id"),
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                };
                const [{ data: favRes }, { data: allRes }] = await Promise.all([
                    axios.get("http://localhost:1000/api/v1/get-favourite-books", { headers }),
                    axios.get("http://localhost:1000/api/v1/get-all-books")
                ]);

                const favs = favRes.data;
                const all = allRes.data;

                // 1. Genre frequency counting
                const genreCount = {};
                favs.forEach(book => {
                    book.genre.forEach(g => {
                        genreCount[g] = (genreCount[g] || 0) + 1;
                    });
                });

                // 2. The genre with the highest frequency
                const sortedGenres = Object.entries(genreCount)
                    .sort((a, b) => b[1] - a[1]);
                if (sortedGenres.length === 0) {
                    setError('There is no favorite genre.');
                    return;
                }
                const [mostFreqGenre] = sortedGenres[0];
                setTopGenre(mostFreqGenre);

                // 3. Filter books with that genre (and which are not already favorites)
                const favIds = new Set(favs.map(b => b._id));
                const genreMatches = all
                    .filter(book =>
                        !favIds.has(book._id) &&
                        book.genre.includes(mostFreqGenre)
                    )
                    .slice(0, 4);

                setBooks(genreMatches);
            } catch (err) {
                console.error(err);
                setError('Could not load recommendations by genre.');
            }
        };

        fetchByGenre();
    }, [isLoggedIn, role]);

    if (!isLoggedIn || role !== 'user') return null;
    if (!books && !error) return <Loader />;
    if (error || books.length === 0) return null;

    return (
        <div className="mt-12 px-4">
            <h4 className="text-3xl text-yellow-100">
                You prefer the <span className="font-semibold">{topGenre}</span> genre, you might also be interested in:
            </h4>
            <div className="my-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8">
                {books.map((b, i) => <BookCard key={i} data={b} />)}
            </div>
        </div>
    );
};

export default RecommendedByGenre;
