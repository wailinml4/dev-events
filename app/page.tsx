import ExploreBtn from '@/components/ExploreBtn'
import EventCard from '@/components/EventCard'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async () => {
  const response = await fetch(`${BASE_URL}/api/events`)
  const { events } = await response.json()


  return (
    <section>
      <h1 className="text-center">DevEvents</h1>
      <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in One Place</p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {events && events.length > 0 && events.map((event: IEvent) => (
            <div key={event.title}>
              <EventCard {...event} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Page