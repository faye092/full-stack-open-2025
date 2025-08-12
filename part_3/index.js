require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const path = require('path')
const { request } = require('http')

const app = express()

app.use(express.json())
app.use(express.static('build'))

morgan.token('body',(req) => 
    req.method === 'POST' && req.body && Object.keys(req.body).length
        ? JSON.stringify(req.body)
        : ''
)
app.use(morgan('tiny'))
app.use(morgan('tiny :body', {
    skip:(req) => req.method !== 'POST'
}))

app.use(cors())

app.get('/api/persons',(req, res) => {
    Person.find({}).then((persons) => {
        res.json(persons)
    })
})

app.post('/api/persons', (req, res, next) => {
    const { name, number } = req.body

    if(!name && !number){
        return res.status(400).json({
            error: 'name and number missing'
        })
    }

    if(!name){
        return res.status(400).json({
            error:'name missing'
        })
    }

    if(!number){
        return res.status(400).json({
            error:'number missing'
        })
    }

    const person = new Person({
        name,
        number
    })
    person
      .save()
      .then(savedPerson => {
        res.json(savedPerson)
      })
      .catch((error) => {
        next(error)
      })
})

app.get('/api/persons/:id',(req, res, next) => {
    Person.findById(req.params.id)
      .then((person) => {
        if(person){
            res.json(person)
        }else{
            res.status(404).end()
        }
      })
      .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const {name, number} = req.body
    const person = {
        name,
        number
    }
    Person.findByIdAndUpdate(req.params.id, person, {
        new: true,
        runValidators: true,
        context: 'query'
    })
      .then((updatedPerson) => {
        if(!updatedPerson){
            return res.status(404).end()
        }
        res.json(updatedPerson)
      })
      .catch((error) => next(error))
})

app.delete('/api/persons/:id',(req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
      .then(() => {
        res.status(204).end()
      })
      .catch((error) => next(error))
})

app.get('/info', (req, res) => {
  Person.find({}).then((persons) => {
    res.send(
      `<p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>`
    )
  })
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error('error.name:', error.name)
    console.error('error.message', error.message)

    if(error.name === 'CastError'){
        return res.status(400).send({ error:'malformatted id'})
    } else if(error.name === 'ValidationError'){
        return res.status(400).json({error: error.message})
    }

    return res.status(500).json({error:'Internal server error'})
}

app.use(errorHandler)


const PORT = process.env.PORT || 8080

app.listen(PORT, '0.0.0.0',()=>{
    console.log(`Server running on port ${PORT}`)
})