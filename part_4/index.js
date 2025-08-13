require('dotenv').config()
const http = require('http')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

//middleware, the order is important
app.use(cors())
app.use(express.json()) //if not exists, there would be req.body undefined 

//database connection
const mongoUrl = process.env.MONGODB_URI
mongoose.set('strictQuery', false)
mongoose.connect(mongoUrl)
  .then(()=> console.log('connected to MongoDB'))
  .catch(error => console.error('error connecting to MongoDB:', err.message))

//Schema/Model
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

//routes
app.get('/api/blogs', async(req, res, next) => {
  try{
    const blogs = await Blog.find()
    res.json(blogs)
  } catch(error){next(error)}
})

app.post('/api/blogs', async(req, res, next) => {
  try{
    const blog = new Blog(req.body)
    const saved = await blog.save()
    res.status(201).json(saved)
  }catch(error){next(error)}
})

//start
const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})