import axios from "axios";

const api_key = import.meta.env.VITE_API_KEY

const baseUrl = `https://api.openweathermap.org/data/3.0/weather`

const getWeather = (lat, lon) => {
    const request = axios.get(
        `${baseUrl}? lat = ${lat} & lon = ${lon} & ppid=${api_key} & units=metric `
    )
    return request.then((response) => response.data)
}

export default getWeather