const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;


  if (!username || !password) {
    return res.status(404).json({ message: "Username and password are required" });
  }

  const userExists = users.find((user) => user.username === username);

  if (userExists) {
    return res.status(400).json({ message: "User already exists!" });
  }


  users.push({ "username": username, "password": password });
  return res.status(200).json({ message: "User registered successfully. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  

  const book = books[isbn]; 

  if (book) {

    return res.status(200).send(JSON.stringify(book, null, 4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  
  // 1. الحصول على جميع مفاتيح الكتب (1, 2, 3...)
  const bookKeys = Object.keys(books);
  const matchingBooks = [];

  // 2. المرور على كل كتاب والتحقق من اسم المؤلف
  bookKeys.forEach((key) => {
    if (books[key].author === author) {
      matchingBooks.push({ isbn: key, ...books[key] });
    }
  });

  // 3. التحقق من وجود نتائج
  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});
// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const matchingBooks = [];

  bookKeys.forEach((key) => {
    if (books[key].title === title) {
      matchingBooks.push({ isbn: key, ...books[key] });
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});
// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    // نرسل حقل الـ reviews فقط الموجود داخل الكتاب
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
