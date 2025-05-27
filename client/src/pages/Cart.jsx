import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader/Loader';
import axios from 'axios';
import { AiFillDelete } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const SHIPPING_FEE = 10;

const Cart = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [cart, setCart] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const headers = {
    id: localStorage.getItem('id'),
    authorization: `Bearer ${localStorage.getItem('token')}`,
  };

  // Load cart
  useEffect(() => {
    axios
      .get('http://localhost:1000/api/v1/get-user-cart', { headers })
      .then(res => setCart(res.data.data))
      .catch(console.error);
  }, []);

  // Calculate subtotal and total (with shipping)
  useEffect(() => {
    if (!cart) return;
    const sum = cart.reduce((acc, book) => acc + book.price, 0);
    setSubtotal(sum);
    setTotal(sum + SHIPPING_FEE);
  }, [cart]);

  // Delete an item from cart
  const deleteItem = async bookId => {
    try {
      const res = await axios.put(
        `http://localhost:1000/api/v1/remove-book-from-cart/${bookId}`,
        {},
        { headers }
      );
      alert(res.data.message);
      setCart(prev => prev.filter(b => b._id !== bookId));
    } catch (err) {
      console.error(err);
    }
  };

  // Process payment and place order
  const handlePayment = async e => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);

    try {
      // Create PaymentIntent on backend
      const { data: { clientSecret } } = await axios.post(
        'http://localhost:1000/api/v1/create-payment-intent',
        { amount: total * 100 },
        { headers }
      );

      // Confirm the card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (error) throw error;

      // If successful, place the order
      if (paymentIntent.status === 'succeeded') {
        await axios.post(
          'http://localhost:1000/api/v1/place-order',
          { order: cart },
          { headers }
        );
        alert('Payment succeeded & order placed!');
        navigate('/profile/order-history');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart === null) {
    return (
      <div className="flex-1 bg-zinc-900 px-12 py-8 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex-1 bg-zinc-900 px-12 py-8 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-semibold text-zinc-400">Empty Cart</h1>
        <img src="/empty-cart.png" alt="empty cart" className="h-64 mt-4" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-zinc-900 px-12 py-8">
      <h1 className="text-5xl md-text-5xl font-semibold text-zinc-500 mb-8">
        Your Cart
      </h1>

      {cart.map((item, i) => (
        <div
          key={i}
          className="w-full my-4 rounded flex flex-col md:flex-row p-4 bg-zinc-800 justify-between items-center"
        >
          <img
            src={item.url}
            alt={item.title}
            className="h-32 md:h-20 object-cover"
          />
          <div className="flex-1 px-4">
            <h2 className="text-2xl text-zinc-100 font-semibold">{item.title}</h2>
            <p className="text-zinc-300 mt-1 hidden lg:block">by {item.author}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-3xl text-zinc-100 font-semibold">
              RON {item.price}
            </span>
            <button
              onClick={() => deleteItem(item._id)}
              className="p-2 bg-red-100 text-red-700 rounded"
            >
              <AiFillDelete size={20} />
            </button>
          </div>
        </div>
      ))}

      <div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between space-y-6 md:space-y-0">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-xl text-zinc-300">Subtotal:</span>
            <span className="text-xl text-zinc-200 font-medium">RON {subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-300">Transport:</span>
            <span className="text-zinc-200 font-medium">RON {SHIPPING_FEE}</span>
          </div>
          <hr className="border-zinc-700" />
          <div className="flex justify-between">
            <span className="text-3xl text-yellow-200 font-bold">Total:</span>
            <span className="text-3xl text-yellow-200 font-bold">RON {total}</span>
          </div>
        </div>

        <form
          onSubmit={handlePayment}
          className="w-full md:w-1/2 lg:w-1/3 bg-zinc-800 p-8 rounded-xl shadow-lg"
        >
          <CardElement
            options={{
              style: {
                base: { color: '#fff', '::placeholder': { color: '#888' } },
                invalid: { color: '#f00' },
              },
            }}
          />
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="mt-6 w-full py-3 bg-yellow-300 text-zinc-900 font-semibold rounded hover:bg-yellow-500 transition"
          >
            {isProcessing ? 'Processing…' : `Pay RON ${total}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Cart;
