const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // تم تعريفها مرة واحدة هنا

// --- User Registration ---
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

// --- Book Retrieval Tasks using Axios & Async/Await ---

// Task 10: Get the list of books available in the shop
public_users.get('/', async function (req, res) {
    try {
        // Simulating an external request using a local function or axios
        const getBooks = () => Promise.resolve(books);
        const allBooks = await getBooks();
        return res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error fetching all books" });
    }
});

// Task 11: Get book details based on ISBN using Axios
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        // Fetching book details by ISBN using a simulated async request
        const response = await Promise.resolve(books[isbn]);
        if (response) {
            return res.status(200).send(JSON.stringify(response, null, 4));
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book by ISBN" });
    }
});

// Task 12: Get book details based on Author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        // Filtering books by author using async logic
        const allBooks = await Promise.resolve(books);
        const matchingBooks = Object.values(allBooks).filter(b => b.author === author);
        
        if (matchingBooks.length > 0) {
            return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
        } else {
            return res.status(404).json({ message: "No books found by this author" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by author" });
    }
});

// Task 13: Get book details based on Title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        // Fetching books that match the title using Async-Await
        const allBooks = await Promise.resolve(books);
        const matchingBooks = Object.values(allBooks).filter(b => b.title.toLowerCase() === title.toLowerCase());
        
        if (matchingBooks.length > 0) {
            return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
        } else {
            return res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by title" });
    }
});

// --- Get book review (Standard Method) ---
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;