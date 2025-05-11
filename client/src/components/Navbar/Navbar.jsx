import React, { useActionState, useState } from 'react';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { FaGripLines } from "react-icons/fa";
import { useSelector } from 'react-redux';

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

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (isLoggedIn === false) {
    links.splice(2, 2);
  }
  const [MobileNav, setMobileNav] = useState("hidden");

  return (
    <>
      <nav className="z-50 relative flex bg-zinc-800 text-white px-8 py-4 items-center justify-between">
        <Link to="/" className="flex items-center">
          <img className="h-10 me-4" src={logo} alt="logo" />
          <h1 className="text-2xl font-semibold">EscapeBook</h1>
        </Link>

        <div className="nav-links-escapebook block md:flex items-center gap-4">
          <div className="hidden md:flex gap-4">
            {
              links.map((items, i) => (
                <div className='flex items-center' key={i}>
                  {
                    items.title === "Profile" ? (
                      <Link
                        to={items.link}
                        className="px-4 py-1 border border-yellow-300 rounded hover:bg-pink-200 hover:text-zinc-800 transition-all duration-300"
                      >
                        {items.title}
                      </Link>
                    ) : (
                      <Link
                        to={items.link}
                        className="hover:text-yellow-300 transition-all duration-300"
                      >
                        {items.title}
                      </Link>
                    )
                  }
                </div>
              ))
            }
          </div>

          {isLoggedIn === false && (
            <div className="hidden md:flex gap-4">
              <Link to="/log-in" className="px-4 py-1 border border-yellow-300 rounded hover:bg-pink-200 hover:text-zinc-800 transition-all duration-300">
                Log In
              </Link>
              <Link to="/sign-up" className="px-4 py-1 border bg-yellow-300 rounded hover:bg-pink-200 hover:text-zinc-800 transition-all duration-300">
                Sign Up
              </Link>
            </div>
          )}

          <button
            className='block md:hidden text-white text-2xl hover:text-zinc-400'
            onClick={() =>
              MobileNav === "hidden"
                ? setMobileNav("block")
                : setMobileNav("hidden")
            }
          >
            <FaGripLines />
          </button>
        </div>
      </nav>

      <div className={`${MobileNav} bg-zinc-800 h-screen absolute top-0 left-0 w-full z-40 flex flex-col items-center justify-center`}>
        {
          links.map((items, i) => (
            <Link
              to={items.link}
              className={`${MobileNav} text-white text-3xl mb-8 font-semibold hover:text-yellow-300 transition-all duration-300`}
              key={i}
              onClick={() =>
                MobileNav === "hidden"
                  ? setMobileNav("block")
                  : setMobileNav("hidden")
              }
            >
              {items.title}{" "}
            </Link>
          ))
        }

        {isLoggedIn === false && (
          <>
            <Link
              to="/log-in"
              className={` ${MobileNav} px-8 mb-8 text-2xl font-semibold py-2 border border-yellow-300 rounded text-white hover:bg-pink-200 hover:text-zinc-800 transition-all duration-300`}
            >
              Log In
            </Link>
            <Link
              to="/sign-up"
              className={` ${MobileNav} px-8 mb-8 text-2xl font-semibold py-2 border bg-yellow-300 rounded hover:bg-pink-200 hover:text-zinc-800 transition-all duration-300`}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar
