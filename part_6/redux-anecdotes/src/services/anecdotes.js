import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

//1. get all data
const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

//2. create new data
const createNew = async (content) => {
  const object = { content, votes: 0}
  const response = await axios.post(baseUrl, object)
  return response.data
}

export default { getAll, createNew }