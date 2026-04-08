const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  const userExists = users.some((user)=>user.username===username);
  return !userExists;
}

const authenticatedUser = (username,password)=>{ //returns boolean
// Check if username and password match the one we have in records.
const user = users.find((user)=>user.username===username && user.password===password);
if(user){
  return true;
}else{
  return false;
}
}
//only registered users can login
regd_users.post("/login", (req,res) => {
const {username,password} = req.body;
if(authenticatedUser(username, password)){
  const accessToken=jwt.sign({data:username},'access',{expiresIn:60*60});
  req.session.authorization={
   accessToken,username
  }
  return res.status(200).send("User successfully logged in");

 
}
 else{
  return res.status(401).json({message: "Invalid username or password"});
 }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review; 
  const username = req.session.authorization.username; 
  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  if (books[isbn]) {
    let book = books[isbn];
    
    // إضافة أو تحديث المراجعة
    // هيكلية المراجعات داخل الكتاب تكون عادة: reviews: {"username": "review text"}
    book.reviews[username] = review;

    return res.status(200).json({ 
      message: `The review for the book with ISBN ${isbn} has been added/updated.`,
      reviews: book.reviews 
    });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username; // استخراج اسم المستخدم من الجلسة

  if (books[isbn]) {
    let book = books[isbn];
    
    // التحقق مما إذا كان المستخدم يملك مراجعة لهذا الكتاب
    if (book.reviews[username]) {
      // حذف المراجعة الخاصة بهذا المستخدم فقط
      delete book.reviews[username];
      
      return res.status(200).json({ 
        message: `Review for ISBN ${isbn} posted by user ${username} has been deleted.` 
      });
    } else {
      return res.status(404).json({ message: "No review found for this user on this book." });
    }
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
