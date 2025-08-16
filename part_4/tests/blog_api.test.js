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
})

describe('GET /api/blogs', () => {
    test('should return json with all blogs', async () => {
        const res = await api
          .get('/api/blogs')
          .expect(200)
          .expect('Content-Type', /application\/json/)

        assert.strictEqual(res.body.length, helper.initialBlogs.length)
    })

    test('blog identifier is named id', async () => {
        const res = await api.get('/api/blogs').expect(200)
        for (const blog of res.body) {
            assert.ok(blog.id)
            assert.strictEqual(blog._id, undefined)
            assert.strictEqual(blog.__v, undefined)
        }
    })
}) 



describe('POST /api/blogs', () => {
    test('creates a new blog', async () => {
        const start = await helper.blogsInDb()
        await api.post('/api/blogs')
          .send({title:'New Post', author:'Faye', url:'http://x.com', likes: 3})
          .expect(201)
          .expect('Content-Type', /json/)
        const end = await helper.blogsInDb()
        assert.strictEqual(end.length, start.length + 1)
        assert.ok(end.map(b => b.title).includes('New Post'))
    })

    test('likes default to 0 if missing', async () => {
        const res = await api.post('/api/blogs')
          .send({title:'no likes', author:'Faye', url:'http://x.com'})
          .expect(201)
        assert.strictEqual(res.body.likes, 0)
    })

    test('missing title returns 400', async () => {
        await api.post('/api/blogs')
          .send({ author:'Faye', url:'http://x.com', likes:1})
          .expect(400)
    })

    test('missing url returns 400', async () => {
        await api.post('/api/blogs')
          .send({title:'no url', author:'Faye', likes:1})
          .expect(400)
    })
    
})

describe('updating of a blog', () => {
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

describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid' , async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
          .delete(`/api/notes/${blogToDelete.id}`)
          .expect(204)
        
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length -1)

        const contents = blogsAtEnd.map(r => r.content)
        assert(!contents.includes(blogToDelete.content))
    })
})

after(async () => {
    await mongoose.connection.close()
})