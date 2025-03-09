// src/data/spaceFacts.ts
export interface SpaceFact {
    id: string;
    category: 'general' | 'sun' | 'mercury' | 'venus' | 'earth' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto' | 'stars' | 'blackholes' | 'galaxies';
    fact: string;
    source?: string;
  }
  
  export const spaceFacts: SpaceFact[] = [
    // General space facts
    {
      id: "fact-1",
      category: "general",
      fact: "Space is completely silent because there is no air to carry sound waves.",
      source: "NASA"
    },
    {
      id: "fact-2",
      category: "general",
      fact: "The footprints left by astronauts on the moon will likely remain there for at least 100 million years since there's no wind to blow them away.",
      source: "NASA"
    },
    {
      id: "fact-3",
      category: "general",
      fact: "If you could fold a piece of paper 42 times, it would reach the moon.",
      source: "Mathematics"
    },
    
    // Sun facts
    {
      id: "fact-4",
      category: "sun",
      fact: "The Sun makes up 99.86% of the mass in our solar system.",
      source: "NASA Solar System Exploration"
    },
    {
      id: "fact-5",
      category: "sun",
      fact: "The Sun is a nearly perfect sphere with a difference of just 10 km in diameter between its poles and equator.",
      source: "NASA"
    },
    {
      id: "fact-6",
      category: "sun",
      fact: "The temperature at the Sun's core is about 15 million °C (27 million °F).",
      source: "NASA"
    },
    
    // Mercury facts
    {
      id: "fact-7",
      category: "mercury",
      fact: "A day on Mercury lasts 59 Earth days, while a year is only 88 Earth days.",
      source: "NASA"
    },
    {
      id: "fact-8",
      category: "mercury",
      fact: "Mercury's surface temperature varies from -173°C to 427°C (-280°F to 800°F), the most extreme in the solar system.",
      source: "NASA"
    },
    {
      id: "fact-9",
      category: "mercury",
      fact: "Despite being the closest planet to the Sun, Venus is actually hotter than Mercury due to its thick atmosphere.",
      source: "NASA"
    },
    
    // Venus facts
    {
      id: "fact-10",
      category: "venus",
      fact: "Venus rotates backwards compared to other planets, meaning the sun rises in the west and sets in the east.",
      source: "NASA"
    },
    {
      id: "fact-11",
      category: "venus",
      fact: "A day on Venus is longer than a year on Venus. It takes 243 Earth days to rotate once, but only 225 Earth days to orbit the Sun.",
      source: "NASA"
    },
    {
      id: "fact-12",
      category: "venus",
      fact: "Venus has a surface pressure 92 times greater than Earth, equivalent to being 900 meters (3,000 feet) underwater.",
      source: "NASA"
    },
    
    // Earth facts
    {
      id: "fact-13",
      category: "earth",
      fact: "Earth is the only planet not named after a god in our solar system.",
      source: "Astronomy"
    },
    {
      id: "fact-14",
      category: "earth",
      fact: "The Earth's rotation is gradually slowing at approximately 17 milliseconds per hundred years.",
      source: "NASA"
    },
    {
      id: "fact-15",
      category: "earth",
      fact: "The highest point on Earth, Mount Everest, is actually not the furthest from Earth's center. That distinction goes to Mount Chimborazo due to Earth's equatorial bulge.",
      source: "National Geographic"
    },
    
    // Mars facts
    {
      id: "fact-16",
      category: "mars",
      fact: "Mars has the largest dust storms in the solar system, sometimes engulfing the entire planet for months.",
      source: "NASA"
    },
    {
      id: "fact-17",
      category: "mars",
      fact: "Mars has the tallest mountain in the solar system, Olympus Mons, at 22km (13.6 miles) high - nearly 3 times the height of Mount Everest.",
      source: "NASA"
    },
    {
      id: "fact-18",
      category: "mars",
      fact: "A year on Mars is 687 Earth days, almost twice as long as an Earth year.",
      source: "NASA"
    },
    
    // Jupiter facts
    {
      id: "fact-19",
      category: "jupiter",
      fact: "Jupiter's Great Red Spot is a giant storm that has been raging for at least 400 years and is big enough to fit 3 Earths inside.",
      source: "NASA"
    },
    {
      id: "fact-20",
      category: "jupiter",
      fact: "Jupiter has the shortest day of all the planets, rotating once every 9.9 hours.",
      source: "NASA"
    },
    {
      id: "fact-21",
      category: "jupiter",
      fact: "Jupiter has more than 79 moons, with the four largest (the Galilean moons) first observed by Galileo Galilei in 1610.",
      source: "NASA"
    },
    
    // Saturn facts
    {
      id: "fact-22",
      category: "saturn",
      fact: "Saturn's rings are made mostly of ice particles, with a small amount of rock and dust.",
      source: "NASA"
    },
    {
      id: "fact-23",
      category: "saturn",
      fact: "Saturn has a density lower than water, which means it would float if placed in a giant bathtub.",
      source: "NASA"
    },
    {
      id: "fact-24",
      category: "saturn",
      fact: "Saturn's moon Titan is the only moon in the solar system with a substantial atmosphere, and it has liquid methane lakes on its surface.",
      source: "NASA"
    },
    
    // Uranus facts
    {
      id: "fact-25",
      category: "uranus",
      fact: "Uranus rotates on its side with an axial tilt of about 98 degrees, likely due to a collision with an Earth-sized object long ago.",
      source: "NASA"
    },
    {
      id: "fact-26",
      category: "uranus",
      fact: "Uranus is the coldest planet in the solar system with a minimum temperature of -224°C (-371°F).",
      source: "NASA"
    },
    {
      id: "fact-27",
      category: "uranus",
      fact: "Uranus was the first planet discovered using a telescope, by William Herschel in 1781.",
      source: "NASA"
    },
    
    // Neptune facts
    {
      id: "fact-28",
      category: "neptune",
      fact: "Neptune has the strongest winds in the solar system, reaching speeds of 2,100 km/h (1,300 mph).",
      source: "NASA"
    },
    {
      id: "fact-29",
      category: "neptune",
      fact: "Neptune was predicted to exist through mathematical calculations before it was directly observed.",
      source: "NASA"
    },
    {
      id: "fact-30",
      category: "neptune",
      fact: "Neptune's moon Triton is one of the few moons in the solar system that orbits in the opposite direction of its planet's rotation.",
      source: "NASA"
    },
    
    // Black hole facts
    {
      id: "fact-31",
      category: "blackholes",
      fact: "If you fell into a black hole, you would experience 'spaghettification' - your body would be stretched into a long, thin shape due to the extreme gravity gradient.",
      source: "Astrophysics research"
    },
    {
      id: "fact-32",
      category: "blackholes",
      fact: "The first image of a black hole was captured in 2019 by the Event Horizon Telescope, showing the supermassive black hole at the center of galaxy M87.",
      source: "Event Horizon Telescope collaboration"
    },
    {
      id: "fact-33",
      category: "blackholes",
      fact: "Time slows down near a black hole due to gravitational time dilation, a phenomenon predicted by Einstein's theory of relativity.",
      source: "Physics"
    },
    
    // Galaxy facts
    {
      id: "fact-34",
      category: "galaxies",
      fact: "There are more stars in the universe than grains of sand on all of Earth's beaches combined.",
      source: "Astronomy"
    },
    {
      id: "fact-35",
      category: "galaxies",
      fact: "The Milky Way galaxy is moving through space at approximately 2.1 million kilometers per hour.",
      source: "NASA"
    },
    {
      id: "fact-36",
      category: "galaxies",
      fact: "The Andromeda Galaxy is on a collision course with our Milky Way and will collide in about 4.5 billion years.",
      source: "NASA"
    },
    
    // Stars facts
    {
      id: "fact-37",
      category: "stars",
      fact: "Neutron stars are so dense that a teaspoon would weigh about 10 million tons on Earth.",
      source: "Astrophysics"
    },
    {
      id: "fact-38",
      category: "stars",
      fact: "The closest star to our solar system, Proxima Centauri, is still over 4.2 light-years away (about 40 trillion km or 25 trillion miles).",
      source: "NASA"
    },
    {
      id: "fact-39",
      category: "stars",
      fact: "Some stars are so large that they could contain more than a billion Suns. UY Scuti is one of the largest known stars with a radius approximately 1,700 times that of the Sun.",
      source: "Astronomy"
    },
  ];