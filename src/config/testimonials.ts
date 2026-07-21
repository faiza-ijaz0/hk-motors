// Curated sample reviews for the homepage testimonial carousel — not sourced
// from the database. Swap for a `testimonials` table fetch once that part
// of the data layer is wired up (see docs/ARCHITECTURE.md §10).
export type Testimonial = {
  id: string;
  name: string;
  rating: 4 | 5;
  quote: string;
  vehicle?: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Ahmed Raza",
    rating: 5,
    quote:
      "From the first walk-through to driving off the lot, everything felt effortless. No pressure, no hidden fees — just an honest, professional team that clearly knows performance vehicles.",
    vehicle: "2023 BMW M4",
  },
  {
    id: "t2",
    name: "Sara Malik",
    rating: 5,
    quote:
      "I'd been to three other dealerships before HK Motors and none of them came close. The inspection report alone gave me the confidence to buy without a second-guess.",
    vehicle: "2022 Mercedes-Benz GLE",
  },
  {
    id: "t3",
    name: "Bilal Hussain",
    rating: 5,
    quote:
      "Sold my old car and bought my next one here in the same week. The trade-in valuation was fair and the whole process took a fraction of the time I expected.",
    vehicle: "2021 Audi Q7",
  },
  {
    id: "t4",
    name: "Fatima Sheikh",
    rating: 5,
    quote:
      "What stood out was how much the team actually knew about the cars — not just sales talk. They walked me through the engine, the service history, everything.",
    vehicle: "2023 Lexus RX",
  },
  {
    id: "t5",
    name: "Usman Tariq",
    rating: 4,
    quote:
      "Great experience overall. Financing took a little longer than I hoped, but the team kept me updated the whole way and the car was worth the wait.",
    vehicle: "2022 Porsche Macan",
  },
  {
    id: "t6",
    name: "Ayesha Khan",
    rating: 5,
    quote:
      "This was my first time buying a premium vehicle and I was nervous going in. HK Motors made it feel like buying from friends who happened to know everything about cars.",
    vehicle: "2023 Range Rover Evoque",
  },
  {
    id: "t7",
    name: "Hamza Farooq",
    rating: 5,
    quote:
      "Six months in and the after-sale service has been just as attentive as the day I bought it. That's rare, and it's exactly why I'll be back for my next car.",
    vehicle: "2021 BMW X5",
  },
  {
    id: "t8",
    name: "Zainab Ali",
    rating: 5,
    quote:
      "The showroom experience alone is worth the visit — but it's the transparency on pricing that actually earned my trust. No games, no last-minute add-ons.",
    vehicle: "2022 Mercedes-Benz C-Class",
  },
  {
    id: "t9",
    name: "Danish Iqbal",
    rating: 5,
    quote:
      "I sourced a very specific model through their team and they found me exactly what I wanted within two weeks. Communication throughout was excellent.",
    vehicle: "2023 Porsche 911",
  },
  {
    id: "t10",
    name: "Maryam Aslam",
    rating: 4,
    quote:
      "Solid inventory and a knowledgeable sales team. Would have liked a few more color options, but the vehicle I got was in immaculate condition.",
    vehicle: "2022 Toyota Land Cruiser",
  },
  {
    id: "t11",
    name: "Kamran Baig",
    rating: 5,
    quote:
      "Every question I had was answered honestly, including the ones about the car's flaws. That kind of honesty is what got my business, and it'll keep it.",
    vehicle: "2021 Audi RS5",
  },
  {
    id: "t12",
    name: "Nida Yousaf",
    rating: 5,
    quote:
      "The registration and paperwork were handled entirely by their team. I didn't have to think about a single form — just showed up and drove home.",
    vehicle: "2023 Honda Civic Type R",
  },
  {
    id: "t13",
    name: "Faisal Chaudhry",
    rating: 5,
    quote:
      "Bought a vehicle sight-unseen based on their photos and description, and it matched perfectly when I picked it up. That level of accuracy says a lot about their standards.",
    vehicle: "2022 BMW X7",
  },
  {
    id: "t14",
    name: "Hira Nawaz",
    rating: 5,
    quote:
      "I've referred two friends to HK Motors since my purchase and both had the same experience I did — genuinely glad to have found a dealership I trust completely.",
    vehicle: "2023 Lexus NX",
  },
  {
    id: "t15",
    name: "Omar Siddiqui",
    rating: 4,
    quote:
      "Professional from start to finish. The test drive process was thorough and unhurried, which made a real difference in my decision.",
    vehicle: "2021 Jeep Grand Cherokee",
  },
  {
    id: "t16",
    name: "Rabia Ahmed",
    rating: 5,
    quote:
      "The certified inspection they provided caught a minor issue I would have never noticed, and they fixed it before I even asked. That's the kind of care that keeps customers.",
    vehicle: "2022 Nissan Patrol",
  },
  {
    id: "t17",
    name: "Tariq Mehmood",
    rating: 5,
    quote:
      "Fifteen years in the industry and this is the first dealership that treated me like a long-term relationship instead of a one-time sale.",
    vehicle: "2023 Mercedes-Benz S-Class",
  },
  {
    id: "t18",
    name: "Sana Rehman",
    rating: 5,
    quote:
      "Everything about the showroom feels premium, but what actually mattered to me was how patiently they answered every question over multiple visits before I committed.",
    vehicle: "2022 Audi Q5",
  },
  {
    id: "t19",
    name: "Junaid Akhtar",
    rating: 5,
    quote:
      "Traded in an older performance car and upgraded through HK Motors. The valuation was fair, the paperwork was fast, and the new car exceeded expectations.",
    vehicle: "2023 Porsche Cayenne",
  },
  {
    id: "t20",
    name: "Mahnoor Iqbal",
    rating: 5,
    quote:
      "Honestly one of the smoothest, most respectful car-buying experiences I've had. HK Motors set a standard I now expect from every dealership.",
    vehicle: "2022 Range Rover Sport",
  },
];
