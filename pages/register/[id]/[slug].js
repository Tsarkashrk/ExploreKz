import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { FaUserAlt } from 'react-icons/fa'
import { useRouter } from 'next/router'
import { HiMail } from 'react-icons/hi'
import { doc, getDoc } from '@firebase/firestore'
import db from '../../../utils/firebase'
import { registerAttendee } from '../../../utils/util'
import RegClosed from '../../../components/RegClosed'
import ErrorPage from '../../../components/ErrorPage'
import { eventService } from '../../../utils/event.service'
import Loading from '../../../components/Loading'
import { useEffect } from 'react'

export async function getServerSideProps(context) {
  const docRef = doc(db, 'events', context.query.id)
  const docSnap = await getDoc(docRef)
  let firebaseEvent = {}
  if (docSnap.exists()) {
    firebaseEvent = docSnap.data()
  } else {
    console.log('No such document!')
  }
  return {
    props: { event: firebaseEvent },
  }
}

const RegisterPage = () => {
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [event, setEvent] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const { query } = useRouter()

  const router = useRouter()
  console.log(router)

  const slug = router.query.slug
  const id = router.query.id

  const fetchEvent = async () => {
    try {
      const response = await eventService.getEventById(id)
      setEvent(response.data)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvent()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    eventService.registerEvent({ event_id: event.id, email }).then((response) => setLoading(false), setSuccess(true), router.push('/'))
    setEmail('')
    setName('')
  }
  if (loading) {
    return <Loading title="Generating your ticket🤞🏼" />
  }
  if (!event.title) {
    return <ErrorPage />
  }

  if (!event.is_active) {
    return <RegClosed event={event} />
  }

  return (
    <div>
      <Head>
        <title>{`${event.title} | Explore Kazakhstan`}</title>
        <meta name="description" content="An event ticketing system built with NextJS and Firebase" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full flex items-center justify-between min-h-[100vh] relative">
        <div className="md:w-[60%] w-full flex flex-col items-center justify-center min-h-[100vh] px-[30px] py-[30px] relative">
          <h2 className="text-2xl font-medium mb-3">Get your ticket 🎉</h2>
          <form className="w-full flex flex-col justify-center" onSubmit={handleSubmit}>
            <label htmlFor="name">Full name</label>
            <div className="w-full relative">
              <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} className="border px-10 py-2 mb-3 rounded-md w-full" required />
              <FaUserAlt className=" absolute left-4 top-3 text-gray-300" />
            </div>

            <label htmlFor="email">Email address</label>
            <div className="w-full relative">
              <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border px-10 py-2 mb-3 rounded-md w-full" required />
              <HiMail className=" absolute left-4 top-3 text-gray-300 text-xl" />
            </div>
            <label htmlFor="nums">Card numbers</label>
            <div className="w-full relative">
              <input type="text" name="nums" className="border px-10 py-2 mb-3 rounded-md w-full" required />
              <HiMail className=" absolute left-4 top-3 text-gray-300 text-xl" />
            </div>
            <label htmlFor="expires">Expires in</label>
            <div className="w-full relative">
              <input type="text" name="expires" className="border px-10 py-2 mb-3 rounded-md w-full" required />
              <HiMail className=" absolute left-4 top-3 text-gray-300 text-xl" />
            </div>
            <label htmlFor="cvv">CVV</label>
            <div className="w-full relative">
              <input type="text" name="cvv" className="border px-10 py-2 mb-3 rounded-md w-full" required />
              <HiMail className=" absolute left-4 top-3 text-gray-300 text-xl" />
            </div>
            <button type="submit" className="bg-[#FFD95A] p-3 font-medium hover:bg-[#C07F00] hover:text-[#FFF8DE] mb-3 rounded-md">
              GET TICKET
            </button>
          </form>
          <div className="absolute bottom-5 left-5">
            <p className="opacity-50 text-sm">
              <Link href="/">{event.title}</Link> &copy; Copyright {new Date().getFullYear()}{' '}
            </p>
          </div>
        </div>
        <div className="login md:w-[40%] h-[100vh] relative">
          <div className="absolute bottom-5 right-5">
            <a href="https://github.com/Tsarkashrk/ExploreKaz" target="_blank" className="text-gray-100">
              Built by Alisher, Bekbolat, Alikhan
            </a>
          </div>
        </div>
        {success && (
          <div className="w-full h-[100vh] dim absolute top-0 flex items-center justify-center z-40">
            <div className="w-[400px] bg-white h-[300px] flex items-center justify-center flex-col rounded-md shadow-[#FFD95A] shadow-md">
              <h2 className="text-2xl font-extrabold mb-4 text-center">Registered Successfully! 🎉</h2>
              <p className="text-center mb-6">Check your email for your ticket and event information.</p>
              <button className="px-4 py-2 bg-[#FFD95A] rounded-md" onClick={() => setSuccess(false)}>
                OK
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
export default RegisterPage
