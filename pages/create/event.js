import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { MdCancel } from 'react-icons/md'
import Link from 'next/link'
import { userService } from '../../utils/user.service'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../utils/firebase'
import { addEventToFirebase } from '../../utils/util'
import { useRouter } from 'next/router'
import Loading from '../../components/Loading'
import { eventService } from '../../utils/event.service'

const event = () => {
  const [user, setUser] = useState({})
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [venue, setVenue] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState('')
  const [price, setPrice] = useState()
  const [image, setImage] = useState(null)
  const [buttonClicked, setButtonClicked] = useState(false)
  const router = useRouter()

  // const isUserLoggedIn = () => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setUser({ email: user.email, uid: user.uid })
  //     } else {
  //       return router.push('/register')
  //     }
  //   })
  // }

  const isUserLoggedIn = async () => {
    try {
      const response = await userService.me()
      setUser({ email: response.data.email, uid: response.data.id })
    } catch (error) {
      console.error('Error fetching user:', error)
      router.push('/register')
    }
  }

  useEffect(() => {
    isUserLoggedIn()
  }, [])

  const handleSubmit = (e) => {
    try {
      e.preventDefault()
      setLoading(true)
      eventService.createEvent({ user_id: String(user.uid), title, date, time, venue, description, note, price, image_url: image, attendees: [], is_active: true }).then(setLoading(false), router.push('/dashboard'))
    } catch (err) {}
  }

  return (
    <div>
      <Head>
        <title>Create New Event | Explore Kazakhstan</title>
        <meta name="description" content="An event ticketing system built with NextJS and Firebase" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold mb-6">Create a new event</h2>
          <Link href="/dashboard">
            <MdCancel className="text-4xl text-[#C07F00] cursor-pointer" />
          </Link>
        </div>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input name="title" type="text" className="border-[1px] py-2 px-4 rounded-md mb-3" required value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="w-full flex justify-between">
            <div className="w-1/2 flex flex-col mr-[20px]">
              <label htmlFor="date">Date</label>
              <input name="date" type="date" className="border-[1px] py-2 px-4 rounded-md mb-3" required value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="w-1/2 flex flex-col">
              <label htmlFor="time">Time</label>
              <input name="time" type="time" className="border-[1px] py-2 px-4 rounded-md mb-3" required value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>
          <label htmlFor="venue">Venue</label>
          <input name="venue" type="text" className="border-[1px] py-2 px-4 rounded-md mb-3" required value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Plot Address, Lagos, Nigeria" />
          <label htmlFor="price">Price (KZT)</label>
          <textarea name="price" rows={2} className="border-[1px] py-2 px-4 rounded-md mb-3" placeholder="Any information or details about the event" value={price} onChange={(e) => setPrice(e.target.value)} />
          <label htmlFor="description">
            Event Description <span className="text-gray-500">(optional)</span>
          </label>
          <textarea name="description" rows={2} className="border-[1px] py-2 px-4 rounded-md mb-3" placeholder="Any information or details about the event" value={description} onChange={(e) => setDescription(e.target.value)} />
          <label htmlFor="note">
            Note to Attendees <span className="text-gray-500">(optional)</span>
          </label>
          <textarea name="note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} className="border-[1px] py-2 px-4 rounded-md mb-3" placeholder="Every attendee must take note of this" />
          <label htmlFor="image">
            Event Image <span className="text-gray-500">(optional)</span>
          </label>
          <textarea name="image" rows={2} className="border-[1px] py-2 px-4 rounded-md mb-3" placeholder="Set the url of your image" value={image} onChange={(e) => setImage(e.target.value)} />
          {loading ? <Loading title="May take longer time for image uploads" /> : <button className="px-4 py-2 bg-[#C07F00] w-[200px] mt-3 text-white rounded-md">Create Event</button>}
        </form>
      </main>
    </div>
  )
}

export default event
