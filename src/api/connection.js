import axios from 'axios'

const api = axios.create({
  baseURL: process.env.API,
  headers: {
    common: {
      'Access-Control-Allow-Origin': '*'
    }
  }
})

export { api }
