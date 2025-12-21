import { useState, useEffect } from 'react'
import axios from 'axios'

export const useField = (type) => {
    const [value, setValue] = useState('')

    const onChange = (event) => {
        setValue(event.target.value)
    }

    const reset = () => {
        setValue('')
    }

    return {
        type,
        value,
        onChange,
        reset
    }
}

export const useCountry = (name) => {
    const [country, setCountry] = useState(null)

    useEffect(() => {
        if(!name){
            setCountry(null)
            return
        }

        //send require
        axios
          .get(`https://restcountries.com/v3.1/name/${name}?fullText=true`)
          .then(response => {
            setCountry({found:true, data:response.data[0]})
          })
          .catch(() => {
            setCountry({found: false})
          })
    }, [name])

    return country
}

export const useResource = (baseUrl) => {
    const [resources, setResources] = useState([])

    useEffect(() => {
        axios
          .get(baseUrl)
          .then(response => {
            setResources(response.data)
          })
          .catch(error => {
            console.error('Error fetching data:', error)
          })
    }, [baseUrl])

    const create = async(resources) => {
        const response = await axios.post(baseUrl,resources)
        setResources(resources.concat(response.data))

        return response.data
    }

    const service = {
        create
    }

    return [resources, service]
}
