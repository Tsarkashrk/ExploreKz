import AuthNav from '../components/AuthNav'
import { useRouter } from 'next/router'
import React, { useEffect, useState, useCallback } from 'react'
import Head from 'next/head'
import NoEvent from '../components/NoEvent'
import Events from '../components/Events'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../utils/firebase'
import { getAllEvents } from '../utils/util'
import Loading from '../components/Loading'
import Link from 'next/link'
import Nav from '../components/Nav'

const exampleData = [
  {
    id: 1,
    title: 'First Event In Qazaqstan',
    date: '19.05.2025',
    time: '19:00',
    description: 'First CS2 Tournament in Qazaqstan',
    price: '19000KZT',
    hint: 'Some hints',
    img: '',
  },
  {
    id: 2,
    title: 'Second Event In Qazaqstan',
    date: '19.05.2025',
    time: '19:00',
    description: 'First CS2 Tournament in Qazaqstan',
    hint: 'Some hints',
    price: '19000KZT',
    img: '',
  },
  {
    id: 3,
    title: 'Third Event In Qazaqstan',
    date: '19.05.2025',
    time: '19:00',
    description: 'First CS2 Tournament in Qazaqstan',
    hint: 'Some hints',
    price: '19000KZT',
    img: '',
  },
]

const CatalogPage = () => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

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
        <div style={{ display: 'flex', padding: '20px', gap: '20px' }}>
          {exampleData.map((item) => (
            <Link href={`/catalog/${item.id}`} style={{ display: 'felx', flexDirection: 'column', gap: '100px', border: '1px solid gray', borderRadius: '10px', padding: '10px' }}>
              {item?.img ? item.img : <img width={250} style={{ borderRadius: '5px' }} src={item?.img ? item.img : `https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg`} />}
              <b>{item.title}</b>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export default CatalogPage
