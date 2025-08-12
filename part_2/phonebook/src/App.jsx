import { useState, useEffect } from 'react'
import personServices from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'
import Persons from './components/Persons'

const App = () => {
  const [allPersons, setAllPersons] = useState([]) 
  const [newPerson, setNewPerson] = useState({name:'',number:''})
  const [filterName, setFilterName] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(()=> {
    console.log('effect: fetching persons data')
    personServices.getAll().then((persons) => {
      setAllPersons(persons)
    })
  }, [])

  useEffect(() => {
    if(notification){
      const timer = setTimeout(() => {
        setNotification(null)
      },4000)
      return () => {
        clearTimeout(timer)
      }
    }
  },[notification])

  const handleFormChange = ({target: {name, value}}) => {
    setNewPerson((newPerson) => ({
      ...newPerson,
      [name]: value
    }))
  }

  const handleFilterChange = (event) => {
    setFilterName(event.target.value)
  }
  
  const handleSubmit = (event) => {
    event.preventDefault()
    const result = allPersons.findIndex(
      (person) => person.name === newPerson.name.trim()
    )
    if(result === -1) {
      personServices
        .create(newPerson)
        .then((person) => {
          setAllPersons((prevPersons) => prevPersons.concat(person))
          setNewPerson({name:'',number:''})
          setNotification({
            type:'success',
            text:`${person.name} was successfully added`
          })
        })
        .catch((error) => {
          setNotification({
            type:'error',
            text: error.response?.data?.error|| "unknown error"
          })
        })
    } else {
      if (
        window.confirm(
          `${newPerson.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const personToUpdate = allPersons[result]
        personServices
          .update(personToUpdate.id, {...newPerson, id:personToUpdate.id})
          .then((updatedPerson) => {
            setAllPersons((prevPersons) => 
              prevPersons.map((person) => 
                person.id !== updatedPerson.id? person : updatedPerson
              )
            )
            setNewPerson({name:'', number:''})
            setNotification({
              type:'success',
              text:`${newPerson.name} was successfully updated` 
            })
          })
          .catch((error) => {
            if(error.response?.status === 404){
              setAllPersons((prevPersons) => 
                prevPersons.filter((person) => person.id !== result.id)
              )
              setNotification({
                type: 'error',
                text:`Information of ${newPerson.name} has already removed from server`
              })
            } else {
              setNotification({
                type: 'error',
                text: error.response?.data?.error || "unknown error"
              })
            }
          })
      }
    }
  }

  const handleRemove = (id, name) => { 
  if(window.confirm(`Delete ${name}?`)){ 
    personServices.remove(id) 
      .then(()=>{ 
        setAllPersons((prevPersons) =>       
          prevPersons.filter((person) => person.id !== id)
        )
        setNotification({
          type:'success',
          text:`${name} was successfully deleted`
        })
      })
      .catch((error) => { 
        if (error.response?.status === 404) {
            setAllPersons((prevPersons) =>
                prevPersons.filter((person) => person.id !== id)
            );
            setNotification({
                type: 'error',
                text: `Information of ${name} was already removed from server.`
            });
        } else {
            setNotification({
                type: 'error',
                text: `Failed to delete ${name}. ${error.response?.data?.error || "Unknown error"}`
            });
        }
      })
  }
}

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification}/>
      <Filter filterName={filterName} handleFilterChange={handleFilterChange}/>
      <h3>add a new</h3>
      <PersonForm 
        newPerson={newPerson}
        handleSubmit={handleSubmit}
        handleFormChange={handleFormChange}
      />
      <h2>Numbers</h2>
      <Persons 
        filterName={filterName}
        allPersons={allPersons}
        handleRemove={handleRemove}
      />  
    </div>
  )
}

export default App