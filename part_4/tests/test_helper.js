const Blog = require('../models/blog')

const initialBlogs = [
  { title: 'React patterns', author: 'Michael Chan', url: 'https://reactpatterns.com/', likes: 7 },
  { title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', url: 'http://example.com/canon', likes: 12 }
]

const newBlog = {

}

const newBlogWithoutLikes = {

}

const blogWithoutTitle = {

}

const blogWithoutUrl = {

}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, 
    blogsInDb
}