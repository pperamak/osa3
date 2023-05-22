require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors =require('cors')
const Person = require('./models/person')
const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

//app.use(morgan('tiny'))
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons=[
  {
    'name': 'Arto Hellas',
    'number': '040-123456',
    'id': 1
  },
  {
    'name': 'Ada Lovelace',
    'number': '39-44-5323523',
    'id': 2
  },
  {
    'name': 'Dan Abramov',
    'number': '12-43-234345',
    'id': 3
  },
  {
    'name': 'Mary Poppendieck',
    'number': '39-23-6423122',
    'id': 4
  }
]



app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    res.send(`<p>Phonebook has info for ${persons.length} persons</p>
    <p> ${new Date().toString()} </p>`)
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    //console.log(persons)
    res.json(persons)
  })

})

app.get('/api/persons/:id', (req, res, next) => {

  Person.findById(req.params.id)
    .then(person => {

      if (person){
        res.json(person)
      }else{
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(res => {
      res.status(204).end()
    })
    .catch(error => next(error))

})

app.post('/api/persons', (req, res, next) => {
  //const newId=Math.floor(Math.random()*9999)
  const body=req.body
  if ((!body.name) || (!body.number)){
    return res.status(400).json({
      error: 'name or number missing'
    })
  }

  if (persons.some(e => e.name===body.name)){
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  //const person=req.body
  //person.id=newId
  //persons=persons.concat(person)
  //res.json(person)
  const person= new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body=req.body

  const person={
    name:body.name,
    number:body.number,
  }

  Person.findByIdAndUpdate(
    req.params.id,
    person,
    { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).json({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})