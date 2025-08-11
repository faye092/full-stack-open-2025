const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  console.log('  node mongo.js <password>                 # list all')
  console.log('  node mongo.js <password> "<name>" "<number>"  # add one')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4] ? process.argv[4] : ''

const url = `mongodb+srv://phonebook:${password}@cluster0.bihtwz0.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema, 'persons')

const person = new Person({
  name,
  number,
})

async function main() {
  await mongoose.connect(url)

  try {
    if (process.argv.length === 3) {

      const persons = await Person.find({})
      console.log('phonebook:')
      persons.forEach(p => console.log(p.name, p.number))
    } else if (process.argv.length === 5) {

      const person = new Person({ name, number })
      await person.save()
      console.log(
        `added ${person.name} ${
          person.number ? `number ${person.number}` : 'without number'
        } to phonebook`
      )
    } else {
      console.log('invalid args. see usage above.')
    }
  } catch (err) {
    console.error('Error:', err.message)
  } finally {
    await mongoose.connection.close()
  }
}

main()
