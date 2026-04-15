import { NextRequest, NextResponse } from 'next/server'; 
import connectDB from '@/lib/db';
import { Event } from '@/models/event.model';

import { v2 as cloudinary } from 'cloudinary';

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

        const file = formData.get('image') as File 
        if (!file) {
            return NextResponse.json({ message: 'Image file is required' }, { status: 400 })
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvents' }, (error, results) => {
                if (error) {
                    return reject(error);
                } else {
                    resolve(results);
                }
            });
            stream.end(buffer);
        });

        event.image = (uploadResult as { secure_url: string}).secure_url;
        const createdEvent = await Event.create(event)

        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 })

    }
    catch(e) {
        console.log(e)
        return NextResponse.json({ message: 'Failed to create event', error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 })
    }
}

export async function GET() { 
    try { 
        await connectDB() 

        const events = await Event.find().sort({ createdAt: -1})
        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 })
    }
    catch(e) { 
        return NextResponse.json({ message: 'Event fetching failed', error: e }, { status: 500})
    }
}