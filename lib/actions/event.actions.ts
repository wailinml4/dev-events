'use server'

import connectDB from '@/lib/db';
import { Event } from '@/models/event.model';

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectDB() 

       const event = await Event.findOne({ slug }).select('tags').lean()

       if (!event) {
        return []
       }

       const similarEvents = await Event.find({
        _id: { $ne: event._id },
        tags: { $in: event.tags  }
       })
        .select('title image slug location date time')
        .lean()

       return similarEvents
       
    }
    catch(e) {
        console.error('Error fetching similar events:', e instanceof Error ? e.message : e)
        return []
    }
}