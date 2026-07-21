// About Us "Achievements" stats — deliberately separate from
// `company-stats.ts` (used by the Homepage Statistics section) so the two
// pages can carry different figures without drifting into each other.
export const aboutAchievements = [
  { value: 15, suffix: "+", label: "Years of Experience" },
  { value: 2500, suffix: "+", label: "Vehicles Sold" },
  { value: 12000, suffix: "+", label: "Happy Clients" },
  { value: 98, suffix: "%", label: "Customer Satisfaction" },
  { value: 500, suffix: "+", label: "Luxury Vehicles Delivered" },
] as const;
