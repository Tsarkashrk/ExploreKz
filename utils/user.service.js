import axios from 'axios'
import { useRouter } from 'next/router'
import { errorMessage, saveTokens, successMessage } from './util'

const BASIC_ROUTE = `${process.env.NEXT_PUBLIC_PRIVATE_API}/api`

export const userService = {
  async register(data, router) {
    const response = await axios
      .post(`${BASIC_ROUTE}/register`, data)
      .then((response) => {
        successMessage('Account created 🎉')
        router.push('/login')
      })
      .catch((error) => {
        console.error(error)
        errorMessage('Account creation declined ❌')
      })
    return response
  },

  async login(data, router) {
    const response = await axios
      .post(`${BASIC_ROUTE}/login`, data)
      .then((response) => {
        saveTokens(response.data.accessToken, response.data.refresh_token)
        successMessage('Authentication successful 🎉')
        router.push('/dashboard')
      })
      .catch((error) => {
        console.error(error)
        errorMessage('Incorrect Email/Password ❌')
      })
    return response
  },

  async me() {
    const accessToken = localStorage.getItem('accessToken')
    const response = await axios.get(`${process.env.NEXT_PUBLIC_PRIVATE_API}/user/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response
  },
}
