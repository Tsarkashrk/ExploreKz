import AuthNav from '../../components/AuthNav'
import { useRouter } from 'next/router'
import React, { useEffect, useState, useCallback } from 'react'
import Head from 'next/head'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../utils/firebase'
import { getEvents } from '../../utils/util'
import Link from 'next/link'

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
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const isUserLoggedIn = useCallback(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({ email: user.email, uid: user.uid })
        getEvents(user.uid, setEvents, setLoading)
      } else {
        return router.push('/register')
      }
    })
  }, [])

  useEffect(() => {
    isUserLoggedIn()
  }, [isUserLoggedIn])

  return (
    <div>
      <Head>
        <title>Events | Explore Kazakhstan</title>
        <meta name="description" content="An event ticketing system built with NextJS and Firebase" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative w-full">
        <AuthNav user={user} />
        <div style={{ display: 'flex', padding: '20px', gap: '20px' }}>
          <Link href={`/catalog/${item.id}`} style={{ border: '1px solid gray', borderRadius: '15px', padding: '20px' }}>
            {item.title} {item?.img ? item.img : <img width={250} src="https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg" />}
          </Link>
        </div>
      </main>
    </div>
  )
}

export default CatalogPage
