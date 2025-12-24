const blogsRouter = require('express').Router()
const { request } = require('express')
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/',async (req, res) => {
    const blogs = await Blog
      .find({})
      .populate('user', {username:1, name:1})
    res.json(blogs)
})

blogsRouter.post('/', userExtractor, async (req, res) => {
    const { user } = req
    if(!user) {
      return res.status(401).json({error:'token invalid'})
    }

    const {title, author, url, likes} = req.body
    if(!title || !url){
      return res.status(400).json({error:'title or url is missing'})
    }
    const blog = new Blog({
      title,
      author,
      url,
      likes: likes ?? 0,
      user: user
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save({ validateModifiedOnly: true})

    res.status(201).json(savedBlog)
})

blogsRouter.put('/', userExtractor, async(req, res) => {
  const {title, author, url, likes} = req.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    {title, author, url, likes},
    {new: true}
  ).populate('user', {username: 1, name: 1})

  res.json(updatedBlog)
} )

blogsRouter.delete('/', userExtractor, async(req, res) => {
  const { user } = req.body

  if(!user) {
    return res.status(401).json({error:'token invalid'})
  }

  const blog = await Blog.findById(req.params.id)

  if(blog?.user.toString() === user.id.toString()){
    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
  }
  else{
    res.status(401).json({error:'unauthorized access'})
  }
})

module.exports = blogsRouter
