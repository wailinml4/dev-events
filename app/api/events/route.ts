import { NextRequest, NextResponse } from 'next/server'; 
import connectDB from '@/lib/db';
import { Event } from '@/models/event.model';

export async function POST (req: NextRequest) {
    try {
        await connectDB() 
        const formData = await req.formData() 

        let event; 

        try {
            event = Object.fromEntries(formData.entries())
        }
        catch(e) {
            return NextResponse.json({ message: 'Invalid form data' }, { status: 400 })
        }

        const createdEvent = await Event.create(event)
        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 })

    }
    catch(e) {
        console.log(e)
        return NextResponse.json({ message: 'Failed to create event', error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 })
    }
}