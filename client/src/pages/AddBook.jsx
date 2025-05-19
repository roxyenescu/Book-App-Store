import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { groupedGenreOptions } from '../constants/genreOptions';


const AddBook = () => {
    const customStylesGenre = {
        control: (base) => ({
            ...base,
            backgroundColor: '#18181b',
            borderColor: '#3f3f46',     
            color: '#e4e4e7',           
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: '#18181b',
            color: '#e4e4e7',
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? '#27272a' : '#18181b', // hover
            color: '#e4e4e7',
            cursor: 'pointer',
        }),
        multiValue: (base) => ({
            ...base,
            backgroundColor: '#3f3f46',
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: '#e4e4e7',
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: '#e4e4e7',
            ':hover': {
                backgroundColor: '#52525b',
                color: 'white',
            },
        }),
    };

    const [Data, setData] = useState({
        url: "",
        title: "",
        author: "",
        genre: [],
        price: "",
        desc: "",
        language: "",
    });

    const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const change = (e) => {
        const { name, value } = e.target;
        setData({ ...Data, [name]: value });
    };

    const submit = async () => {
        try {
            if (
                Data.url === "" ||
                Data.title === "" ||
                Data.author === "" ||
                Data.genre.length === 0 ||
                Data.price === "" ||
                Data.desc === "" ||
                Data.language === ""
            ) {
                alert("All fields are required!");
            } else {
                const response = await axios.post(
                    "http://localhost:1000/api/v1/add-book",
                    Data,
                    { headers }
                );
                setData({
                    url: "",
                    title: "",
                    author: "",
                    genre: [],
                    price: "",
                    desc: "",
                    language: "",
                });
                alert(response.data.message);
            }
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <div className='h-[100%] p-0 md:p-4'>
            <h1 className='text-3xl md:text-5xl font-semibold text-zinc-500 mb-8'>
                Add Book
            </h1>
            <div className='p-4 bg-zinc-800 rounded'>
                <div>
                    <label className='text-zinc-400'>
                        Image
                    </label>
                    <input
                        type='text'
                        className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
                        placeholder='url of image'
                        name='url'
                        required
                        value={Data.url}
                        onChange={change}
                    />
                </div>
                <div className='mt-4'>
                    <label className='text-zinc-400'>
                        Title of book
                    </label>
                    <input
                        type='text'
                        className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
                        placeholder='title of book'
                        name='title'
                        required
                        value={Data.title}
                        onChange={change}
                    />
                </div>
                <div className='mt-4'>
                    <label className='text-zinc-400'>
                        Author of book
                    </label>
                    <input
                        type='text'
                        className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
                        placeholder='author of book'
                        name='author'
                        required
                        value={Data.author}
                        onChange={change}
                    />
                </div>
                <div className="mt-4">
                    <label className="text-zinc-400">
                        Genre
                    </label>
                    <Select
                        isMulti
                        name="genre"
                        options={groupedGenreOptions}
                        styles={customStylesGenre}
                        className="mt-2"
                        classNamePrefix="select"
                        value={groupedGenreOptions
                            .flatMap(group => group.options)
                            .filter(option => Data.genre.includes(option.value))
                        }
                        onChange={(selected) => {
                            const genres = selected.map(option => option.value);
                            setData({ ...Data, genre: genres });
                        }}
                    />
                </div>
                <div className='mt-4 flex gap-4'>
                    <div className='w-3/6'>
                        <label className='text-zinc-400'>
                            Language
                        </label>
                        <input
                            type='text'
                            className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
                            placeholder='language of book'
                            name='language'
                            required
                            value={Data.language}
                            onChange={change}
                        />
                    </div>
                    <div className='w-3/6'>
                        <label className='text-zinc-400'>
                            Price
                        </label>
                        <input
                            type='number'
                            className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
                            placeholder='price of book'
                            name='price'
                            required
                            value={Data.price}
                            onChange={change}
                        />
                    </div>
                </div>
                <div className='mt-4'>
                    <label className='text-zinc-400'>
                        Description of book
                    </label>
                    <textarea
                        className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
                        rows='5'
                        placeholder='description of book'
                        name='desc'
                        required
                        value={Data.desc}
                        onChange={change}
                    />
                </div>

                <button
                    className='mt-4 px-3 bg-yellow-500 text-white font-semibold py-2 rounded hover:bg-yellow-600 transition-all duration-300'
                    onClick={submit}
                >
                    Add Book
                </button>
            </div>
        </div>
    );
};

export default AddBook
