const CountryFilter = ({ filter, handleFilterChange}) => {
    return (
      <form>
        find countries <input 
        value={filter}
        onChange={handleFilterChange} 
        />
      </form>
    )
}

export default CountryFilter