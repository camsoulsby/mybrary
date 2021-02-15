const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
// All books route
router.get('/', async (req, res) => {
    res.send("all books")
})

// New books route
router.get('/new', async (req, res) => {
try {
    const authors = await Author.find({})
    book = new Book()
    res.render('books/new', {
        authors: authors,
        book: book
    })
} catch {
    res.redirect('/books')
}
})

// Create book route
router.post('/', async (req,res) => {
    res.send(" create books")
})


module.exports = router