import ExploreBtn from '@/components/ExploreBtn'
import EventCard from '@/components/EventCard'

import { events } from "@/lib/constants";

const Page = () => {
  return (
    <section>
      <h1 className="text-center">DevEvents</h1>
      <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in One Place</p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Page