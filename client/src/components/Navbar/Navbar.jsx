import React from 'react';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';


const Navbar = () => {
  const links = [
    {
      title: "Home",
      link: "/",
    },
    {
      title: "All Books",
      link: "/all-books",
    },
    {
      title: "Cart",
      link: "/cart",
    },
    {
      title: "Profile",
      link: "/profile",
    },
  ];

  return (
    <div className="flex bg-zinc-800 text-white px-8 py-4 items-center justify-between">
      <Link to="/" className="flex items-center">
        <img className="h-10 me-4" src={logo} alt="logo" />
        <h1 className="text-2xl font-semibold">EscapeBook</h1>
      </Link>

      <div className="nav-links-escapebook flex items-center gap-4">
        <div className="flex gap-4">
          {
            links.map((items, i) => (
              <Link
                to={items.link}
                className="hover:text-yellow-300 transition-all duration-300"
                key={i}
              >
                {items.title}
              </Link>
            ))
          }
        </div>

        <div className="flex gap-4">
          <Link to="/log-in" className="px-4 py-1 border border-yellow-300 rounded hover:bg-pink-200 hover:text-zinc-800 transition-all duration-300">
            Log In
          </Link>
          <Link to="/sign-up" className="px-4 py-1 border bg-yellow-300 rounded hover:bg-pink-200 hover:text-zinc-800 transition-all duration-300">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Navbar
