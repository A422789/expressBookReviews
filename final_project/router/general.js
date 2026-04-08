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

const axios = require('axios');

// Task 10: Get the list of books available in the shop using Async-Await
public_users.get('/', async function (req, res) {
    try {
        
        const fetchBooks = async () => {
            return books;
        };

        const allBooks = await fetchBooks();
        
        return res.status(200).send(JSON.stringify(allBooks, null, 4));

    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});
const axios = require('axios');

// Task 11: Get book details based on ISBN using Axios to request our own "/" endpoint
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        // نستخدم axios لطلب الـ endpoint الأساسية اللي بترجع كل الكتب
        // هيك بنطبق الـ Async/Await مع Axios بشكل حقيقي
        const response = await axios.get('http://localhost:5000/');
        const allBooks = response.data;

        // البحث عن الكتاب المطلوب بناءً على الـ ISBN من البيانات المستلمة
        const book = allBooks[isbn];

        if (book) {
            return res.status(200).send(JSON.stringify(book, null, 4));
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        // في حال فشل طلب الأكسيوس (مثلاً السيرفر غير مستجيب)
        return res.status(500).json({ message: "Error fetching books data via Axios" });
    }
});
  
// Task 12: Get book details based on Author using Async-Await with Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    // 1. نطلب كل الكتب من الـ Endpoint الأساسية باستخدام Axios
    const response = await axios.get('http://localhost:5000/');
    const allBooks = response.data;
    
    // 2. تحويل الكائن إلى مصفوفة والبحث عن الكتب التي تطابق اسم المؤلف
    const bookKeys = Object.keys(allBooks);
    const matchingBooks = [];

    bookKeys.forEach((key) => {
      if (allBooks[key].author === author) {
        matchingBooks.push({ isbn: key, ...allBooks[key] });
      }
    });

    // 3. إرجاع النتائج أو رسالة خطأ إذا لم يوجد المؤلف
    if (matchingBooks.length > 0) {
      return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }

  } catch (error) {
    // في حال فشل Axios (مثلاً السيرفر غير مستجيب)، نستخدم البيانات المحلية كاحتياط
    const matchingBooks = Object.values(books).filter(b => b.author === author);
    if (matchingBooks.length > 0) {
        return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    }
    return res.status(500).json({ message: "Error fetching books by author" });
  }
});
// Task 13: Get book details based on Title using Async-Await with Axios
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    // 1. استخدام Axios لجلب كل الكتب من الـ Endpoint الأساسية
    const response = await axios.get('http://localhost:5000/');
    const allBooks = response.data;
    
    // 2. البحث عن الكتب التي تطابق العنوان المطللوب
    const bookKeys = Object.keys(allBooks);
    const matchingBooks = [];

    bookKeys.forEach((key) => {
      if (allBooks[key].title.toLowerCase() === title.toLowerCase()) {
        matchingBooks.push({ isbn: key, ...allBooks[key] });
      }
    });

    // 3. إرسال النتائج
    if (matchingBooks.length > 0) {
      return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }

  } catch (error) {
    // احتياط في حال فشل الطلب عبر Axios
    const matchingBooks = Object.values(books).filter(b => b.title.toLowerCase() === title.toLowerCase());
    if (matchingBooks.length > 0) {
        return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    }
    return res.status(500).json({ message: "Error fetching books by title" });
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
