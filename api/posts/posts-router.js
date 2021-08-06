// implement your posts router here
const express = require('express')
const Posts = require('./posts-model')

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const posts = await Posts.find(req.query)
        res.json(posts)
    } 
    catch (error) {
        res.status(500).json({ message: "The posts information could not be retrieved" })
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const post = await Posts.findById(id)
        if (post) {
            res.json(post)
        } 
        else {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
    } 
    catch (error) {
        res.status(500).json({ message: "The posts information could not be retrieved" })
    }
})

router.post('/', async (req, res) => {
    const { title, contents } = req.body
    try {
        if (title && contents) {
            Posts.insert({title, contents})
            .then(({id}) => {
                return Posts.findById(id)
            })
            .then(post => {
                res.status(201).json(post)
            })
        } 
        else {
            res.status(400).json({ message: "Please provide title and contents for the post" })
        }
    } 
    catch (error) {
        res.status(500).json({ message: "There was an error while saving the post to the database" })
    }
})


router.put('/:id', async (req, res) => {
    const { id } = req.params
    const { title, contents } = req.body
    const post = await Posts.findById(id)
    try {
        if (!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
        else if (!title || !contents) {
            res.status(400).json({ message: "Please provide title and contents for the post" })
        }
        else {
            await Posts.update(id, { title, contents })
            const updatedPost = await Posts.findById(id)
            res.json(updatedPost)
        }
    }
    catch {
        res.status(500).json({ message: "The post information could not be modified" })
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    const post = await Posts.findById(id)
    try {
        if (!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
        else {
            await Posts.remove(id)
            .then(data => {
                res.json(post)
            })
        }
    }
    catch (error) {
        res.status(500).json({ message: "The post could not be removed" })
    }
})

router.get('/:id/comments', async (req, res) => {
    const { id } = req.params
    const post = await Posts.findById(id)
    try {
        if (!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
        else {
            const comments = await Posts.findPostComments(id)
            res.json(comments)
        }

    }
    catch (error) {
        res.status(500).json({ message: "The comments information could not be retrieved" })
    }
})


module.exports = router