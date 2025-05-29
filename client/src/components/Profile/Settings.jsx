import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from '../Loader/Loader';

const Settings = () => {
    const [ProfileData, setProfileData] = useState();
    const [Value, setValue] = useState({ address: "" });
    const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const change = (e) => {
        const { name, value } = e.target;
        setValue({ ...Value, [name]: value });
    }

    useEffect(() => {
        const fetch = async () => {
            const response = await axios.get(
                "http://localhost:1000/api/v1/get-user-info",
                { headers }
            );
            setProfileData(response.data);
            setValue({ address: response.data.address });
        };
        fetch();
    }, []);

    const submitAddress = async () => {
        const response = await axios.put(
            "http://localhost:1000/api/v1/update-address",
            Value,
            { headers }
        );
        alert(response.data.message);
    }
    return (
        <>
            {!ProfileData && (
                <div className='w-full h-[100%] flex items-center justify-center'>
                    <Loader />
                </div>
            )}
            {ProfileData && (
                <div className="h-full p-4 text-zinc-100 space-y-6">
                    <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500">
                        Settings
                    </h1>

                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1">Username</label>
                            <p className="p-2 bg-zinc-800 rounded font-semibold">{ProfileData.username}</p>
                        </div>

                        <div>
                            <label className="block mb-1">Email</label>
                            <p className="p-2 bg-zinc-800 rounded font-semibold">{ProfileData.email}</p>
                        </div>

                        <div>
                            <label className="block mb-1">First name</label>
                            <p className="p-2 bg-zinc-800 rounded font-semibold">{ProfileData.firstName}</p>
                        </div>

                        <div>
                            <label className="block mb-1">Last name</label>
                            <p className="p-2 bg-zinc-800 rounded font-semibold">{ProfileData.lastName}</p>
                        </div>

                        <div>
                            <label className="block mb-1">Address</label>
                            <textarea
                                className="w-full p-2 bg-zinc-800 rounded font-semibold"
                                rows="5"
                                name="address"
                                value={Value.address}
                                onChange={change}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            className="bg-yellow-500 text-zinc-900 font-semibold px-4 py-2 rounded hover:bg-yellow-400 transition-colors"
                            onClick={submitAddress}
                        >
                            Update
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Settings
