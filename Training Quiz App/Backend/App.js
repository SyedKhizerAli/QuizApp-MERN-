const { db } = require('./Mongoose')
const express = require("express");
const quizRoutes = require('./Routes/Quiz');
const userRoutes = require('./Routes/User');
const cors = require('cors');

const app = express();

require('dotenv').config();

const hostname = process.env.HOST;
const port = process.env.PORT; 

app.use(express.json())
app.use(cors());

app.use('/api', quizRoutes);
app.use('/api', userRoutes);

app.get("/", (req, res) => {
  res.send("backend is working !!!"); 
});

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});