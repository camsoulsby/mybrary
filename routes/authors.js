const express = require('express')
const router = express.Router()
const Author = require('../models/author')
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
//  res.redirect(`authors/${newAuthor.id}`)
            res.redirect(`authors`)
    } catch {
        //if promise fails, go back to the new page, passing back the author (so we can use the name to populate the feild)
        res.render('authors/new', {
                        author: author,
                        errorMessage: 'Error creating author'
        })
    }

})


module.exports = router