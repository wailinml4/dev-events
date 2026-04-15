'use client'

import { useState } from "react"
import { createBooking } from "@/lib/actions/booking.actions";

const BookEvent = ({eventId}: {eventId: string}) => {
  const [email, setEmail] = useState('');   
  const [submitted, setSubmitted] = useState(false);  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { success, error } = await createBooking({ eventId, email })

    if (success) {
      setSubmitted(true) 
    }
    else {
        console.error('Booking creation error', error)
    }
  }

  return (
    <div id="book-event">
      {submitted ? <p>Thank you for signing up!</p> : (
        <form onSubmit={handleSubmit}>
            <div className="text-sm">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" />
            </div>

            <button type="submit" className="button-submit">Submit</button>
        </form>

      )}
    </div>
  )
}

export default BookEvent
