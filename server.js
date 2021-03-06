'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');

const Book = require('./Models/bookModel.js');
const verifyUser = require('./auth.js');

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
  console.log('Mongoose is connected!');
});


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get('/books', handleGetBooks);
app.post('/books', handlePostBooks);
app.delete('/books/:id', handleDeleteBook);
app.get('/test', (request, response) => {
  verifyUser(request, (error, user) =>{
    if(error){
      response.send('invalid token');
    }else{
      response.send('test request received and validated');
    }
  })

})
app.put('/books/:id',handlePutBooks);

async function handleGetBooks(req,res) {
  let queryObj = {email: req.query.email};
  console.log('getting books...');
  try {
    let books = await Book.find(queryObj);
    if (books) {
      console.log(books);
      res.status(200).send(books);
    } else {
      console.log('no books found');
      res.status(404).send('No books found');
    }
  } catch (error) {
    console.log('');
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

async function handlePostBooks(req,res) {
  try {
    let newBook = await Book.create(req.body);
    res.status(201).send(newBook);
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
}

async function handleDeleteBook(req, res) {
  console.log(req.query.email);
  let bookToDelete = await Book.findById(req.params.id);
  console.log(bookToDelete);
  if (bookToDelete) {
    if (req.query.email === bookToDelete.email) {
      await Book.deleteOne({_id: bookToDelete._id});
      res.status(202).send("Book successfully deleted!")
    } else {
      res.status(403).send('Incorrect email!');
    }
  }else{
    res.status(404).send('Not deleted: Book not found')
  }
}

async function handlePutBooks(req,res) {
  const id = req.params.id;
  const newBook = {...req.body, email:req.query.email};
  try {
    let updatedBook = await Book.findByIdAndUpdate(id, newBook, {new: true,overwrite: true});
    res.status(200).send(updatedBook)
  } catch(err) {
    res.status(500).send('server error');
    console.error(err);
  }
}

app.listen(PORT || 3001, () => console.log(`listening on ${PORT}`));
