const mongoose = require('mongoose');
require('dotenv').config();

const Book = require('./Models/bookModel');

async function seed() {
    mongoose.connect(process.env.DB_URL);

    await Book.create({
        title: 'Name of the Wind',
        status: 'Book status',
        description:'summary of Name of the Wind :p',
        email: 'userEmail@gmail.com'
    });
    
    await Book.create({
        title: 'Punishment',
        status: 'Book status',
        description:'summary of Punishment :p',
        email: 'anotherUserEmail@gmail.com'
    });
    
    await Book.create({
        title: 'Song of Ice and Fire',
        status: 'Book status',
        description:'summary of Song of Ice and Fire :p',
        email: 'yetAnotherUserEmail@gmail.com'
    });

    mongoose.disconnect();
}

seed();