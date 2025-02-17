import AuthNav from '../../components/AuthNav'
import { useRouter } from 'next/router'
import React, { useEffect, useState, useCallback } from 'react'
import Head from 'next/head'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../utils/firebase'
import { CiLocationOn, CiMoneyBill, CiCalendarDate } from 'react-icons/ci'
import { userService } from '../../utils/user.service'
import { getEvents } from '../../utils/util'
import Link from 'next/link'
import Nav from '../../components/Nav'
import { eventService } from '../../utils/event.service'

const item = {
  id: 1,
  title: 'First Event In Qazaqstan',
  date: '19.05.2025',
  time: '19:00',
  description: 'First CS2 Tournament in Qazaqstan',
  price: '19000KZT',
  hint: 'Some hints',
  img: '',
}

const CatalogPage = () => {
  const router = useRouter()
  const [user, setUser] = useState({})
  const [event, setEvent] = useState([])
  const [loading, setLoading] = useState(true)
  const [validImages, setValidImages] = useState({})

  const id = router.query.id
  console.log(router)

  const isUserLoggedIn = async () => {
    try {
      const response = await userService.me()
      setUser(response.data)
      setLoading(false)
      console.log('asd')
    } catch (error) {
      console.error('sdf')
    }
  }

  // useEffect(() => {
  //   isUserLoggedIn()
  // }, [])

  const checkImageExists = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }

  const fetchEvent = async () => {
    try {
      const response = await eventService.getEventById(id)
      setEvent(response.data)

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
    isUserLoggedIn()
    fetchEvent()
  }, [])

  const formattedDate = item.date
    ? new Date(item.date).toLocaleString('en-EN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Unknown date'

  const imageSrc = validImages[item.id] ? item.image_url : 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg'

  return (
    <div>
      <Head>
        <title>Event | Explore Kazakhstan</title>
        <meta name="description" content="An event ticketing system built with NextJS and Firebase" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative w-full">
        {user ? <AuthNav user={user} /> : <Nav />}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '20px', gap: '25px', maxWidth: '700px', width: '100%', margin: '0 auto' }}>
          <img width="100%" style={{ borderRadius: '5px' }} src={imageSrc} alt={event.title} />
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
            <b>{event.title}</b>
            <p style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>Description: {event.description}</p>
            <p style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <CiLocationOn /> {event.venue}
            </p>
            <p style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <CiCalendarDate /> {formattedDate}
            </p>
            <p style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <CiMoneyBill /> {event.price}
            </p>
            <Link href={`http://localhost:3000/register/${event.id}/event${event.id}`} style={{ backgroundColor: 'orange', color: 'white', padding: '5px', textAlign: 'center', borderRadius: '5px' }}>
              Buy Ticket
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CatalogPage
