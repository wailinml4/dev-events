
// how come its not export type EventItem? 

export interface EventItem {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export const events: EventItem[] = [
  {
    title: "Google I/O 2026",
    image: "/images/event1.png",
    slug: "google-io-2026",
    location: "Mountain View, CA",
    date: "2026-05-13",
    time: "10:00 AM PDT",
  },
  {
    title: "KubeCon + CloudNativeCon North America 2026",
    image: "/images/event2.png",
    slug: "kubecon-cloudnativecon-na-2026",
    location: "Los Angeles, CA",
    date: "2026-11-16",
    time: "9:00 AM PST",
  },
  {
    title: "React Summit 2026",
    image: "/images/event3.png",
    slug: "react-summit-2026",
    location: "Amsterdam, Netherlands",
    date: "2026-06-12",
    time: "9:30 AM CEST",
  },
  {
    title: "PyCon US 2026",
    image: "/images/event4.png",
    slug: "pycon-us-2026",
    location: "Pittsburgh, PA",
    date: "2026-04-22",
    time: "9:00 AM EDT",
  },
  {
    title: "DEF CON 34",
    image: "/images/event5.png",
    slug: "defcon-34",
    location: "Las Vegas, NV",
    date: "2026-08-06",
    time: "8:00 AM PDT",
  },
  {
    title: "Web Summit 2026",
    image: "/images/event6.png",
    slug: "web-summit-2026",
    location: "Lisbon, Portugal",
    date: "2026-11-10",
    time: "9:00 AM WET",
  },
];
