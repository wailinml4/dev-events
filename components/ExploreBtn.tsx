'use client'

import Image from "next/image"

const ExploreBtn = () => {
  return (
    <div>
      <button type="button" id="explore-btn" className="mt-7 mx-auto" onClick={() => console.log("Explore Button Clicked")}>
        <a href="#events">
            Explore Events
            <Image src="/icons/arrow-down.svg" alt="arrow-down" width={25} height={24} />
        </a>
      </button>
    </div>
  )
}

export default ExploreBtn


