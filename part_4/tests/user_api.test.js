const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')
const { before } = require('lodash')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async ()=> {
    await User.deleteMany({})
    await User.insertMany(helper.userInDb)
})

describe('creating a new user', () => {
    test('should add new user if the username is unique and the password is long enough', async ()=> {
        const usersAtStart = await helper.usersInDb()

        await api
          .post('/api/users/')
          .send(newUser)
          .expect(201)
          .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    })
})