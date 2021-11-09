'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');

const Book = require('./Models/bookModel.js');

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
  console.log('Mongoose is connected!');
});


const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/books', handleGetBooks);
app.get('/test', (request, response) => {

  response.send('test request received')

})

async function handleGetBooks(req,res) {
  let queryObj = {email: req.query.email};
  console.log('getting books...');
  try {
    let books = await Book.find(queryObj);
    if (books) {
      res.status(200).send(books);
    } else {
      res.status(404).send('No books found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

app.listen(PORT || 3001, () => console.log(`listening on ${PORT}`));
