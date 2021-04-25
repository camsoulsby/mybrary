const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')
// All authors route
router.get('/', async (req, res) =>{
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
        

    }
    try {
        
        const authors = await Author.find(searchOptions)
        //render the authors/index view, passing in the list of matching authors as well as the query (to re-populate feilds)
        res.render('authors/index', {
            authors: authors,
            searchOptions: req.query
             })
    } catch {
        //if the promise is rejected, go back to the home page
        res.redirect('/')
    }
})

// New Authors (view page to submit new author) 
// This must be defined above the "get by ID" request otherwise the server will think that "new" is an ID
router.get('/new', (req, res) => {
    //render page, passing in a new (blank author object)
    res.render('authors/new', { author: new Author()})
})

// Create Authors
router.post('/', async (req,res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
const newAuthor = await author.save()
  res.redirect(`authors/${newAuthor.id}`)
            
    } catch {
        //if promise fails, go back to the new page, passing back the author (so we can use the name to populate the feild)
        res.render('authors/new', {
                        author: author,
                        errorMessage: 'Error creating author'
        })
    }
})


    router.get('/:id', async (req, res) => {
        try {
            const author = await Author.findById(req.params.id)
            const books = await Book.find({ author: author.id}).limit(6).exec()
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch {
        res.redirect('/')
       }

    })

    router.get('/:id/edit', async (req, res) =>{
        try{
            const author = await Author.findById(req.params.id)
            res.render('authors/edit', { author: author })
        } catch {
            res.redirect('/authors/')
        }
        
    })

    router.put('/:id', async (req, res) => {
       let author
        
        try {
            author = await Author.findById(req.params.id)
            author.name = req.body.name
            await author.save()
            res.redirect(`/authors/${author.id}`)
                
        } catch {
            if (author == null) {
                res.redirect('/')
            } else {

            res.render('authors/edit', {
                            author: author,
                            errorMessage: 'Error updating author'
            })
        }
        
        }
    })

    router.delete('/:id', async (req, res) => {
        let author
        
        try {
            author = await Author.findById(req.params.id)
        
            await author.remove()
            res.redirect('/authors')
                
        } catch {
            if (author == null) {
                res.redirect('/')
            } else {

            res.redirect(`/authors/${author.id}`)
            }
        }

    })




module.exports = router
