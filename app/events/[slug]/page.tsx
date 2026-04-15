import { notFound } from 'next/navigation'
import Image from 'next/image';

import BookEvent from '@/components/BookEvent';
import { getSimilarEventsBySlug } from '@/lib/actions/event.actions';
import type { IEvent } from '@/models/event.model';

import EventCard from '@/components/EventCard';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


// REUSABLE COMPONENTS -------------------------------------------------------------------------------------------------------------
const EventDetailItem = ({ icon, alt, label }: { icon: string, alt: string, label: string }) => (
  <div className="flex items-center gap-2">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
)

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
)

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag) => (
      <div key={tag} className="pill">{tag}</div>
    ))}
  </div>
)

const toStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []

// -------------------------------------------------------------------------------------------------------------






const EventDetailsPage = async ({ params }: { params: Promise<{slug: string}> }) => {
  const { slug } = await params; 
  const request = await fetch(`${BASE_URL}/api/events/${slug}`) 
  const { event: { description, image, overview, date, time, location, mode, agenda, audience, organizer, tags} } = await request.json() 

  if(!description) return notFound()

  const agendaItems = toStringArray(agenda)
  const tagItems = toStringArray(tags)

  const bookings = 10 // Placeholder for number of bookings, replace with real data when available
  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug)

  return (
    <section id="event">
      <h1>Event Description</h1>
      <p>{description}</p>

      <div className="details">
        { /* Left Side - Event Content */}
        <div className="content">
          <Image src={image} alt="Event Banner" width={800} height={800} className="banner" />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
            <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience} />
          </section>

            <EventAgenda agendaItems={agendaItems}/>
            <section className="flex-col-gap-2">
              <h2>Organizer</h2>
              <p>{organizer}</p>
            </section>

            <EventTags tags={tagItems} />
            
        </div>

        { /* Right Side - Booking Form */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? <p>Join {bookings} people who have already booked their spot!</p>: <p>Be the first to book your spot!</p>}
            <BookEvent />

          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {similarEvents.length > 0 && similarEvents.map((event) => (
            event.image && event.title && event.slug ? (
              <div key={event.slug}>
                <EventCard
                  title={event.title}
                  image={event.image}
                  slug={event.slug}
                  location={event.location}
                  date={event.date}
                  time={event.time}
                />
              </div>
            ) : null
          ))}
        </div>
      </div>
    </section>
  )
}

export default EventDetailsPage
