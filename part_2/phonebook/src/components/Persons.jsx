const Persons = ({filterName, allPersons, handleRemove}) => {
    const filteredPersons = () => {
        return allPersons.filter((person) => 
            person.name.toLowerCase().includes(filterName.toLowerCase().trim())
        )
    }

    const persons =
        filterName.trim().length === 0 ? allPersons :filteredPersons()
    
    return (
        <div>
            {persons.map((person) => (
                <p key={person.id}>
                    {person.name} {person.number}
                    <button onClick={() => handleRemove(person.id, person.name)}>
                        delete
                    </button>
                </p>
            ))}
        </div>
    )
}

export default Persons