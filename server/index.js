const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();
require("./connection/connection");

// COLLECTIONS
const User = require("./routes/user-route");

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/v1", User);


app.get('/', (req, res) => {
  res.send('Hello EscapeBook!');
});

// CREATING PORT
app.listen(process.env.PORT, () => {
  console.log(`-> Server started on port ${process.env.PORT}`);
})