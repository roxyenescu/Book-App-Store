const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();
require("./connection/connection");



// MIDDLEWARE
app.use(cors());
app.use(express.json());




app.get('/', (req, res) => {
  res.send('Hello EscapeBook!');
});

// CREATING PORT
app.listen(process.env.PORT, () => {
  console.log(`-> Server started on port ${process.env.PORT}`);
})