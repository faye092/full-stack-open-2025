const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(express.json())
app.use(express.static('build'))

morgan.token('body',(req) => 
    req.method === 'POST' && req.body && Object.keys(req.body).length
        ? JSON.stringify(req.body)
        : ''
)
app.use(morgan('tiny'))
app.use(morgan('tiny:body', {
    skip:(req) => req.method !== 'POST'
}))

app.use(cors())

let persons = [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(req, res) => res.json(persons))

app.get('/api/persons/:id',(req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (!person) return res.status(404).json({error:'person not found'})
    res.json(person)
})

app.get('/info',(req, res)=> {
    const infoPage = `
      <p>Phonebook has info for ${persons.length} people</p>
      <p> ${new Date()} </p>  
    `
    res.send(infoPage)
})

app.delete('/api/persons/:id',(req, res) => {
    const id = Number(request.params.id)
    if(Number.isNaN(id))
        return res.status(400).json({error:'invalid id'})

    const before = persons.length
    persons = persons.filter(person => person.id !== id)
    if(persons.length === before)
        return res.status(404).json({error:'person not found'})
    
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if(!body.name || !body.number){
        return res.status(400).json({
            error:'name or number is missing'
        })
    }

    const nameExists = persons.find(person => person.name === body.name)
    if(nameExists){
        return res.status(400).json({
            error:'name must be unique'
        })
    }
    const newId = Math.floor(Math.random()*100000000)
    const newPerson = {
        id: newId,
        name: body.name,
        number: body.number
    }
    persons = persons.concat(newPerson)
    res.status(201).location(`/api/persons/${newId}`).json(newPerson)
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 8080

app.listen(PORT, '0.0.0.0',()=>{
    console.log(`Server running on port ${PORT}`)
})