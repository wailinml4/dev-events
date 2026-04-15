"use server"

import connectDB from "@/lib/db"
import { Booking } from "@/models/booking.model"

export const createBooking = async ({ eventId, email }: { eventId: string, email: string}) => {
    try {
        await connectDB() 
        const booking = await Booking.create({ eventId, email })
        return { success: true, booking }
    }
    catch(e) {
        console.error('create booking failed', e)
        return { success: false, error: e }
    }
}