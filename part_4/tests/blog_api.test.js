const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforEach(async ()=> {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    await User.deleteMany({})
    await User.insertMany([])
    await helper.addLoginUser()
})

describe('GET /api/blogs', () => {
  test('should return blogs as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('should return correct amount of blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('should return blogs with right unique identifier property', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined()
      expect(blog._id).toBeUndefined()
    })
  })
}) 



describe('POST /api/blogs', () => {
    test('creates a new blog that has the right content', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const loggedUser = await api.post('/api/login').send(helper.loginUser)
        const res = await api.post('/api/blogs').set('Authorization', `Bearer ${loggedUser.body.token}`).send(helper.newBlog)
        const newBlog = res.body
        const blogAtEnd = await helper.blogsInDb()

        expect(newBlog.title).toEqual(helper.newBlog.title)
        expect(newBlog.author).toEqual(helper.newBlog.author)
        expect(newBlog.url).toEqual(helper.newBlog.url)
        expect(newBlog.user.username).toEqual(loggedUser.body.username)
        expect(blogAtEnd).toHaveLength(blogsAtStart.length + 1)
    })

    test('add a blog with zero likes if the likes property is missing', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const loggedUser = await api.post('/api/login').send(helper.loginUser)
        const res = await api.post('/api/blogs/').set('Authorization', `Bearer ${loggedUser.body.token}`).send(helper.newBlogWithoutLikes)
        const newBlog = res.body
        const blogAtEnd= await helper.blogsInDb()

        expect(newBlog.likes).toBe(0)
        expect(blogAtEnd).toHaveLength(blogsAtStart.length + 1)
    })

    test('should fail if the title property is missing', async ()=> {
        const blogsAtStart = await helper.blogsInDb()
        const loggedUser = await api.post('/api/login').send(helper.loginUser)
        await api.post('/api/blogs/').set('Authorization', `Bearer ${loggedUser.body.token}`).send(helper.blogWithoutTitle).expect(400)
        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    })

    test('should fail if the url property is missing', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const loggedUser = (await api.post('/api/login')).send(helper.loginUser)
        await api.post('/api/blogs/').set('Authorization', `Bearer ${loggedUser.body.token}`).send(helper.blogWithoutUrl).expect(400)
        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    }) 
})

describe('PUT /api/blogs', () => {
    test('shold update details of an existing blog successfully', async ()=> {
        const blogsAtStart = await helper.blogsInDb()
        const blogToBeUpdated = { ...blogsAtStart[0] }
        blogToBeUpdated.likes++

        await api
          .put(`/api/blogs/${blogToBeUpdated.id}`)
          .send(blogToBeUpdated)
          .expect(200)
        
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

        const updatedBlog = blogsAtEnd.find(
            (blog) => blog.id === blogToBeUpdated.id
        )
        expect(updatedBlog).toEqual(blogToBeUpdated)
    })
})

describe('DELETE /api/blog', () => {
    test('succeeds with status code 204 if id is valid' , async () => {
        const blogsAtStart = await helper.blogsInDb()
        const loggedUser = await api.post('/api/login').send(helper.loginUser)
        const res = await api.post('/api/blogs').set('authorizaiton', `Bearer ${loggedUser.body.token}`).send(helper.newBlog)
        const blogsAfterAddition = await helper.blogsInDb()

        await api
          .delete(`/api/blogs/${res.body.id}`)
          .set('authorization', `Bearer ${loggedUser.body.token}`)
          .expect(204)
        const blogsAtEnd = await helper.blogsInDb()
        
        expect(blogsAfterAddition).toHaveLength(blogsAtStart.length + 1)
        expect(blogsAtEnd).toHaveLength(blogsAfterAddition - 1)
    })
})

after(async () => {
    await mongoose.connection.close()
})