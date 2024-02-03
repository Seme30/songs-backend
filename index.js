
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const songRouter = require('./routes/SongRoutes.js');
const statsRouter = require('./routes/StatRoutes.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors());
// Option 2: Allow Custom Origins
// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type'],
//   })
// );

app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send('Welcome To Addis!');
  });


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });




app.use('/songs', songRouter);
app.use('/stats', statsRouter);


module.exports = app