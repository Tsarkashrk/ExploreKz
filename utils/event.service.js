import axios from 'axios'

const BASIC_ROUTE = `${process.env.NEXT_PUBLIC_PRIVATE_API}/events`

export const eventService = {
  async getAllEvents() {
    const response = await axios.get(`${BASIC_ROUTE}/list`)
    console.log(response)
    return response
  },

  async createEvent(data) {
    const response = await axios.post(`${BASIC_ROUTE}/create`, data)
    return response
  },

  async getEventById(id) {
    const response = await axios.get(`${BASIC_ROUTE}/get?id=${id}`)
    return response
  },

  async editEvent(id, data) {
    const response = await axios.put(`${BASIC_ROUTE}/update?id=${id}`, data)
    return response
  },

  async deleteEvent(id) {
    const response = await axios.put(`${BASIC_ROUTE}/delete?id=${id}`)
    return response
  },

  async registerEvent(data) {
    const response = await axios.post(`${BASIC_ROUTE}/register`, data)
    return response
  },
}
