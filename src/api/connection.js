import axios from 'axios'

const api = axios.create({
  baseURL: process.env.API,
  header: {
    'Content-Type': 'multipart/form-data',
    common: {
      'Access-Control-Allow-Origin': '*'
    }
  }
})

export { api }
