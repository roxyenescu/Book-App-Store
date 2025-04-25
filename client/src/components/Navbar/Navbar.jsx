import React from 'react';
import logo from '../../images/logo.png';

const Navbar = () => {
  const links = [
    {
      title: "Home",
      link: "/",
    },
    {
      title: "About us",
      link: "/about-us",
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
      <div className="flex items-center">
        <img className="h-10 me-4" src={logo} alt="logo" />
        <h1 className="text-2xl font-semibold">EscapeBook</h1>
      </div>

      <div className="nav-links-escapebook flex items-center gap-4">
        <div className="flex gap-4">
          {
            links.map((items, i) => (
              <div className="hover:text-yellow-300 transition-all duration-300" key={i}>
                {items.title}
              </div>
            ))
          }
        </div>

        <div className="flex gap-4">
          <button className="px-2 py-1 border border-yellow-300 rounded hover:bg-pink-200 hover:text-zinc-800 transition-all duration-300">Log In</button>
          <button className="px-2 py-1 border bg-yellow-300 rounded hover:bg-pink-200 hover:text-zinc-800 transition-all duration-300">Sign Up</button>

        </div>
      </div>
    </div>
  )
}

export default Navbar
