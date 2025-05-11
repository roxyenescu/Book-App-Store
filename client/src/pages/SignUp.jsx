import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const [Values, setValues] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    address: ""
  });

  const navigate = useNavigate();

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...Values, [name]: value });
  };

  const submit = async () => {
    try {
      if (Values.username === "" || Values.email === "" || Values.firstName === "" || Values.lastName === "" || Values.password === "" || Values.address === "") {
        alert("All fields are required!");
      } else {
        const response = await axios.post(
          "http://localhost:1000/api/v1/sign-up", 
          Values
        );
        alert(response.data.message);
        navigate("/log-in");
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className='h-auto bg-zinc-900 px-12 py-8 flex items-center justify-center'>
      <div className='bg-zinc-800 rounded-lg px-8 py-5 w-full md:w-3/6 lg:w-2/6'>
        <p className='text-zinc-200 text-2xl font-semibold'>
          SIGN UP
        </p>

        <div className='mt-4'>
          <div>
            <label htmlFor='' className='text-zinc-400'>
              Username
            </label>
            <input
              type='text'
              className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
              placeholder='ex: maria_popescu_20'
              name='username'
              required
              value={Values.username}
              onChange={change}
            />
          </div>

          <div className='mt-4'>
            <label htmlFor='' className='text-zinc-400'>
              First name
            </label>
            <input
              type='text'
              className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
              placeholder='ex: Maria'
              name='firstName'
              required
              value={Values.firstName}
              onChange={change}
            />
          </div>

          <div className='mt-4'>
            <label htmlFor='' className='text-zinc-400'>
              Last name
            </label>
            <input
              type='text'
              className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
              placeholder='ex: Popescu'
              name='lastName'
              required
              value={Values.lastName}
              onChange={change}
            />
          </div>

          <div className='mt-4'>
            <label htmlFor='' className='text-zinc-400'>
              Email
            </label>
            <input
              type='text'
              className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
              placeholder='email@example.com'
              name='email'
              required
              value={Values.email}
              onChange={change}
            />
          </div>

          <div className='mt-4'>
            <label htmlFor='' className='text-zinc-400'>
              Password
            </label>
            <input
              type='password'
              className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
              placeholder='********'
              name='password'
              required
              value={Values.password}
              onChange={change}
            />
          </div>

          <div className='mt-4'>
            <label htmlFor='' className='text-zinc-400'>
              Addresss
            </label>
            <textarea
              rows='5'
              className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
              placeholder='address'
              name='address'
              required
              value={Values.address}
              onChange={change}
            />
          </div>

          <div className='mt-4'>
            <button
              className='w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-200 transition-all duration-300'
              onClick={submit}
            >
              Sign Up
            </button>
          </div>

          <p className='flex mt-4 items-center justify-center text-zinc-200 font-semibold'>
            OR
          </p>

          <p className='flex mt-4 items-center justify-center text-zinc-500 font-semibold'>
            Already have an account? &nbsp;
            <Link to='/log-in' className='text-blue-200 hover:text-blue-500'>
              <u>Log In</u>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp
