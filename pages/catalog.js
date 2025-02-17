import AuthNav from '../components/AuthNav'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { CiLocationOn, CiMoneyBill, CiCalendarDate } from 'react-icons/ci'
import Loading from '../components/Loading'
import Link from 'next/link'
import Nav from '../components/Nav'
import { userService } from '../utils/user.service'
import { eventService } from '../utils/event.service'

const CatalogPage = () => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [validImages, setValidImages] = useState({})

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

  useEffect(() => {
    fetchEvents()
    isUserLoggedIn()
  }, [])

  if (loading) return <Loading />

  return (
    <div>
      <Head>
        <title>Events | Explore Kazakhstan</title>
        <meta name="description" content="An event ticketing system built with NextJS and Firebase" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative w-full">
        {user ? <AuthNav user={user} /> : <Nav />}
        <div style={{ display: 'flex', padding: '20px', gap: '20px', flexWrap: 'wrap' }}>{events.length > 0 ? events.map((item) => <CatalogItem key={item.id} item={item} validImages={validImages} />) : <p>No events available</p>}</div>
      </main>
    </div>
  )
}

const CatalogItem = ({ item, validImages }) => {
  if (!item) return null

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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        border: '1px solid #e5e7eb',
        borderRadius: '15px',
        padding: '10px',
        maxWidth: '280px',
        textDecoration: 'none',
        color: 'inherit',
      }}>
      <img width="100%" style={{ borderRadius: '5px' }} src={imageSrc} alt={item.title} />
      <b>{item.title}</b>
      <p style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <CiLocationOn /> {item.venue}
      </p>
      <p style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <CiCalendarDate /> {formattedDate}
      </p>
      <p style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <CiMoneyBill /> {item.price}
      </p>
      <Link href={`/catalog/${item.id}`} style={{ backgroundColor: 'orange', color: 'white', padding: '5px', textAlign: 'center', borderRadius: '5px' }}>
        Details
      </Link>
    </div>
  )
}

export default CatalogPage
