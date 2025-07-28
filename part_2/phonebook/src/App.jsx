import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({filterName, handleFilterChange}) => {
  return (
    <div>
      filter shown with 
      <input 
      value={filterName}
      onChange={handleFilterChange}
      />
    </div>
  )
}

const PersonForm = ({addPerson, newName, handleNameChange, newNumber, handleNumberChange}) => {
  return(
    <form onSubmit={addPerson}>
        <div>
          name: <input 
            value={newName}
            onChange={handleNameChange}
          />
        </div>
        <div>
          number: <input 
            value={newNumber}
            onChange={handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Person = ({person}) => {
  return(
    <div>
      {person.name} {person.number}
    </div>
  )
}

const Persons = ({personsToShow}) => {
  return(
    <>
      {personsToShow.map(person => 
        <Person key={person.id} person={person}/>
      )}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=> {
    console.log('effect: fetching persons data')
    setLoading(true)
    setError(null)
    axios
      .get('http://localhost:5174/persons')
      .then(response => {
        console.log('promise fulfilled: persons data received')
        setPersons(response.data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching persons data:', error)
        setLoading(false)
        setError('Failed to load phonebook data. Please ensure JSON Server is running.')
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)  
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilterName(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    
    const nameExists = persons.some(person => person.name === newName)

    if(nameExists){
      alert(`${newName} is already added to phonebook`)
    }else{
      const personObject = {
       name: newName,
       number: newNumber

      }
      setPersons(persons.concat(personObject))
    }
    setNewName('')
    setNewNumber('')
  }

  const filterPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filterName.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterName={filterName} handleFilterChange={handleFilterChange}/>
      <h3>add a new</h3>
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      {loading ? (
        <div>Loading phonebook data</div>
      ): error ? (
        <div style={{color: 'red'}}> Error: {error}</div>
      ) : (
        <Persons personsToShow={filterPersons}/>
      )}
      
    </div>
  )
}

export default App