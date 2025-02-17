import React, { useEffect, useState, useCallback } from 'react'
import Head from 'next/head'
import AuthNav from '../components/AuthNav'
import { eventService } from '../utils/event.service'
import NoEvent from '../components/NoEvent'
import Events from '../components/Events'
import { useRouter } from 'next/router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../utils/firebase'
import { getEvents } from '../utils/util'
import Loading from '../components/Loading'
import { userService } from '../utils/user.service'

const dashboard = () => {
  const router = useRouter()
  const [user, setUser] = useState({})
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const isUserLoggedIn = async () => {
    try {
      const response = await userService.me()
      setUser(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching user:', error)
      router.push('/register')
    }
  }

  const checkImageExists = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }

  const fetchEvents = async () => {
    try {
      const response = await eventService.getAllEvents()
      setEvents(response.data)

      const imageChecks = await Promise.all(
        response.data.map(async (item) => {
          if (item?.image_url) {
            return { id: item.id, exists: await checkImageExists(item.image_url) }
          }
          return { id: item.id, exists: false }
        }),
      )

      const imageMap = imageChecks.reduce((acc, { id, exists }) => {
        acc[id] = exists
        return acc
      }, {})

      setValidImages(imageMap)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
    isUserLoggedIn()
  }, [])

  if (loading) return <Loading title="Your dashboard is almost ready.🍚" />
  return (
    <div>
      <Head>
        <title>Dashboard | Explore Kazakhstan</title>
        <meta name="description" content="An event ticketing system built with NextJS and Firebase" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <AuthNav user={user} />
        {events.length > 0 ? <Events events={events} /> : <NoEvent />}
      </main>
    </div>
  )
}

export default dashboard
