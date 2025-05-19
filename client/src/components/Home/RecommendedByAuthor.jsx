import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import BookCard from '../BookCard/BookCard';
import Loader from '../Loader/Loader';

const RecommendedByAuthor = () => {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const role = useSelector(state => state.auth.role);

    const [books, setBooks] = useState(null);
    const [topAuthor, setTopAuthor] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isLoggedIn || role !== 'user') return;

        const fetchByAuthor = async () => {
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

                if (favs.length === 0) {
                    setError('First add some favorites for author recommendations.');
                    return;
                }

                // 1. Author frequency counting
                const authorCount = {};
                favs.forEach(book => {
                    authorCount[book.author] = (authorCount[book.author] || 0) + 1;
                });

                // 2. Choose the author with the highest frequency or, if all have count = 1, the author of the first favorite book
                const entries = Object.entries(authorCount);
                let chosenAuthor;
                if (entries.every(([, cnt]) => cnt === 1)) {
                    chosenAuthor = favs[0].author;
                } else {
                    chosenAuthor = entries.sort((a, b) => b[1] - a[1])[0][0];
                }

                // 2.1. Function that returns recommendations for a given author
                const getMatches = (author) => {
                    const favIds = new Set(favs.map(b => b._id));
                    return all.filter(b =>
                        b.author === author &&
                        !favIds.has(b._id)
                    ).slice(0, 4);
                };

                // 3. Try with the chosen author first
                let matches = getMatches(chosenAuthor);

                // 4. If there are no matches, look for the first other author in your favorites who has recommendations
                if (matches.length === 0) {
                    // unique authors in order of favs
                    const uniqueFavAuthors = Array.from(new Set(favs.map(b => b.author)));
                    for (const author of uniqueFavAuthors) {
                        if (author === chosenAuthor) continue;
                        const m = getMatches(author);
                        if (m.length > 0) {
                            chosenAuthor = author;
                            matches = m;
                            break;
                        }
                    }
                }

                // 5. If there are still no recommendations, nothing is displayed.
                if (matches.length === 0) {
                    setError('No recommendations were found for the author at this time.');
                    return;
                }

                setTopAuthor(chosenAuthor);
                setBooks(matches);
            } catch (err) {
                console.error(err);
                setError('Could not load recommendations by author.');
            }
        };

        fetchByAuthor();
    }, [isLoggedIn, role]);

    if (!isLoggedIn || role !== 'user') return null;
    if (!books && !error) return <Loader />;
    if (error || books.length === 0) return null;

    return (
        <div className="mt-12 px-4">
            <h4 className="text-3xl text-yellow-100">
                You are interested in books by author <span className="font-semibold">{topAuthor}</span>, maybe you would also be interested in these:
            </h4>
            <div className="my-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8">
                {books.map((b, i) => <BookCard key={i} data={b} />)}
            </div>
        </div>
    );
};

export default RecommendedByAuthor;
