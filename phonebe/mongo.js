const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://pperamak:${password}@clusterfshy.72wo4nj.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length===3){
  console.log('phonebook:')
  Person.find({}).then(persons => {
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
if (process.argv.length===5){
  const nimi=process.argv[3]
  const num=process.argv[4]

  const person=new Person({
    name: nimi,
    number: num,
  })

  person.save().then(() => {
    console.log(`added ${nimi} number ${num} to phonebook`)
    mongoose.connection.close()
  })
}