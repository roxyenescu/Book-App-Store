const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();
require("./connection/connection");

// COLLECTIONS
const User = require("./routes/user-route");
const Books = require("./routes/book-route");
const Favourite = require("./routes/favourite-route");
const Cart = require("./routes/cart-route");
const Order = require("./routes/order-route");
const Review = require('./routes/review-route');
const Sentiment = require('./routes/sentiment-route');

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/v1", User);
app.use("/api/v1", Books);
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);
app.use('/api/v1', Review);
app.use('/api/v1', Sentiment);


app.get('/', (req, res) => {
  res.send('Hello EscapeBook!');
});

// CREATING PORT
app.listen(process.env.PORT, () => {
  console.log(`-> Server started on port ${process.env.PORT}`);
})