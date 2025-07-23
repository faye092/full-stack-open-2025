import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)  
  }

  const addPerson = (event) => {
    event.preventDefault()
    
    const nameExists = persons.some(person => person.name === newName)

    if(nameExists){
      alert(`${newName} is already added to phonebook`)
    }else{
      const personObject = {
       name: newName  
      }
      setPersons(persons.concat(personObject))
    }
    setNewName('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input 
            value={newName}
            onChange={handleNameChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>debug: {newName}</div>
      {persons.map(person => 
        <div>
          {person.name}
        </div>
      )}
    </div>
  )
}

export default App