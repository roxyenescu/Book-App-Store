import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader/Loader';
import { Link } from 'react-router-dom';
import { FaUserLarge } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { IoOpenOutline } from "react-icons/io5";
import SeeUserData from './SeeUserData';

const AllOrders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [filterStatus, setFilterStatus] = useState("All");
  const [optionsIndex, setOptionsIndex] = useState(-1);
  const [statusValue, setStatusValue] = useState({ status: "" });
  const [userDiv, setuserDiv] = useState("hidden");
  const [userDivData, setuserDivData] = useState(null);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:1000/api/v1/get-all-orders",
          { headers }
        );
        setAllOrders(data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, []);

  // Remove the dummy at the end if present
  const clean = allOrders.slice(0, -1);

  // Apply status filter
  const filtered = clean.filter(o =>
    filterStatus === "All" ? true : o.status === filterStatus
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const pageOrders = filtered.slice(start, start + itemsPerPage);

  const submitChanges = async idx => {
    const order = pageOrders[idx];
    const { data } = await axios.put(
      `http://localhost:1000/api/v1/update-status/${order._id}`,
      statusValue,
      { headers }
    );
    alert(data.message);

    // Update the single record in place
    setAllOrders(orders =>
      orders.map(o =>
        o._id === order._id
          ? { ...o, status: statusValue.status }
          : o
      )
    );
  };

  if (!allOrders.length) {
    return <div className="h-[100%] flex items-center justify-center"><Loader /></div>;
  }

  return (
    <>
      <div className="h-[100%] p-0 md:p-4 text-zinc-100">
        <h1 className="text-3xl md-text-5xl font-semibold text-zinc-500 mb-4">
          All Orders
        </h1>

        {/* Filter control */}
        <div className="mb-4 flex items-center gap-2">
          <label className="text-zinc-300">Filter by status:</label>
          <select
            className="bg-zinc-800 p-2 rounded"
            value={filterStatus}
            onChange={e => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            {["All", "Order Placed", "Out of delivery", "Delivered", "Canceled"]
              .map((s, i) => <option key={i} value={s}>{s}</option>)
            }
          </select>
        </div>

        {/* Table header */}
        <div className="mt-4 bg-zinc-800 w-full rounded py-2 px-4 flex gap-2">
          <div className="w-[3%]">
            <h1 className="text-center">Nr.</h1>
          </div>
          <div className="w-[40%] md:w-[22%]">
            <h1>Books</h1>
          </div>
          <div className="w-0 md:w-[45%] hidden md:block">
            <h1>Description</h1>
          </div>
          <div className="w-[17%] md:w-[9%]">
            <h1>Price</h1>
          </div>
          <div className="w-[30%] md:w-[16%]">
            <h1>Status</h1>
          </div>
          <div className="w-[10%] md:w-[5%]">
            <h1><FaUserLarge /></h1>
          </div>
        </div>

        {/* Paginated rows */}
        {pageOrders.map((order, idx) => (
          <div
            key={order._id}
            className="bg-zinc-800 w-full rounded py-2 px-4 flex gap-2 hover:bg-zinc-900 hover:cursor-pointer transition-all duration-300"
          >
            <div className="w-[3%]">
              <h1 className="text-center">{start + idx + 1}</h1>
            </div>

            <div className="w-[40%] md:w-[22%]">
              <Link
                to={`/view-book-details/${order.book._id}`}
                className="hover:text-blue-300"
              >
                {order.book.title}
              </Link>
            </div>

            <div className="w-0 md:w-[45%] hidden md:block">
              <h1>{order.book.desc.slice(0, 50)} ...</h1>
            </div>

            <div className="w-[17%] md:w-[9%]">
              <h1>{order.book.price} RON</h1>
            </div>

            <div className="w-[30%] md:w-[16%]">
              <h1 className="font-semibold">
                <button
                  className="hover:scale-105 transition-all duration-300"
                  onClick={() => setOptionsIndex(idx)}
                >
                  <span className={
                    order.status === "Order Placed" ? "text-yellow-200" :
                      order.status === "Out of delivery" ? "text-orange-400" :
                        order.status === "Canceled" ? "text-red-500" :
                          "text-green-500"
                  }>
                    {order.status}
                  </span>
                </button>
                <div className={`${optionsIndex === idx ? 'block' : 'hidden'} flex mt-4`}>
                  <select
                    name="status"
                    className="bg-gray-800 p-1 rounded"
                    onChange={e => setStatusValue({ status: e.target.value })}
                    value={statusValue.status}
                  >
                    {["Order Placed", "Out of delivery", "Delivered", "Canceled"]
                      .map((s, i) => <option key={i} value={s}>{s}</option>)
                    }
                  </select>
                  <button
                    className="text-green-500 hover:text-pink-600 mx-2"
                    onClick={() => {
                      setOptionsIndex(-1);
                      submitChanges(idx);
                    }}
                  >
                    <FaCheck />
                  </button>
                </div>
              </h1>
            </div>

            <div className="w-[10%] md:w-[5%]">
              <button
                className="text-xl hover:text-orange-500"
                onClick={() => {
                  setuserDiv("fixed");
                  setuserDivData(order.user);
                }}
              >
                <IoOpenOutline />
              </button>
            </div>
          </div>
        ))}

        {/* Pagination controls */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-zinc-700 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`
                px-3 py-1 rounded
                ${currentPage === i + 1
                  ? "bg-yellow-500 text-black"
                  : "bg-zinc-700 hover:bg-zinc-600"
                }
              `}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-zinc-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {userDivData && (
        <SeeUserData
          userDivData={userDivData}
          userDiv={userDiv}
          setuserDiv={setuserDiv}
        />
      )}
    </>
  );
};

export default AllOrders;
