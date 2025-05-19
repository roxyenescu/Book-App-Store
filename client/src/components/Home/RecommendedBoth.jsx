import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import BookCard from '../BookCard/BookCard';
import Loader from '../Loader/Loader';

const RecommendedBoth = () => {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const role = useSelector(state => state.auth.role);

    const [books, setBooks] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isLoggedIn || role !== 'user') return;

        const fetchBoth = async () => {
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

                const favAuthors = new Set(favs.map(b => b.author));
                const favGenres = new Set(favs.flatMap(b => b.genre));
                const favIds = new Set(favs.map(b => b._id));

                const bothMatches = all.filter(b => {
                    if (favIds.has(b._id)) return false;
                    const isAuthor = favAuthors.has(b.author);
                    const isGenre = b.genre.some(g => favGenres.has(g));
                    return isAuthor && isGenre;
                });

                setBooks(bothMatches.slice(0, 4));
            } catch (err) {
                console.error(err);
                setError('Unable to load author and genre recommendations.');
            }
        };
        fetchBoth();
    }, [isLoggedIn, role]);

    if (!isLoggedIn || role !== 'user') return null;
    if (!books && !error) return <Loader />;
    if (error || books.length === 0) return null;

    return (
        <div className="mt-12 px-4">
            <h4 className="text-3xl text-yellow-100">
                We have prepared some books for you that suit both your favorite authors and genres:
            </h4>
            <div className="my-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8">
                {books.map((b, i) => <BookCard key={i} data={b} />)}
            </div>
        </div>
    );
};

export default RecommendedBoth;
