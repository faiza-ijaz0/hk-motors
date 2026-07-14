// Mock data for the Super Admin Dashboard UI only. Deliberately not wired
// to Supabase — there's no auth yet, so there's no real session to scope
// admin queries to. Replace with real data once auth exists.

export type MockUser = {
  id: string;
  fullName: string;
  email: string;
  role: "super_admin" | "admin" | "employee";
  status: "active" | "invited" | "suspended";
  joinedAt: string;
};

export const mockUsers: MockUser[] = [
  {
    id: "1",
    fullName: "Ayesha Khan",
    email: "ayesha@hkmotors.com",
    role: "super_admin",
    status: "active",
    joinedAt: "2024-01-10",
  },
  {
    id: "2",
    fullName: "Bilal Ahmed",
    email: "bilal@hkmotors.com",
    role: "admin",
    status: "active",
    joinedAt: "2024-03-22",
  },
  {
    id: "3",
    fullName: "Sara Malik",
    email: "sara@hkmotors.com",
    role: "employee",
    status: "active",
    joinedAt: "2024-06-15",
  },
  {
    id: "4",
    fullName: "Usman Tariq",
    email: "usman@hkmotors.com",
    role: "employee",
    status: "invited",
    joinedAt: "2025-01-05",
  },
  {
    id: "5",
    fullName: "Fatima Noor",
    email: "fatima@hkmotors.com",
    role: "employee",
    status: "suspended",
    joinedAt: "2024-09-18",
  },
];

export type MockCarStatus =
  "draft" | "pending_review" | "published" | "reserved" | "sold" | "archived";

export type MockCar = {
  id: string;
  title: string;
  makeModel: string;
  year: number;
  price: number;
  status: MockCarStatus;
  createdAt: string;
};

export const mockCars: MockCar[] = [
  {
    id: "1",
    title: "2022 BMW M4 Competition",
    makeModel: "BMW M4",
    year: 2022,
    price: 18500000,
    status: "published",
    createdAt: "2025-05-02",
  },
  {
    id: "2",
    title: "2021 Mercedes-AMG C63 S",
    makeModel: "Mercedes-AMG C63",
    year: 2021,
    price: 21200000,
    status: "published",
    createdAt: "2025-04-18",
  },
  {
    id: "3",
    title: "2023 Audi RS5 Sportback",
    makeModel: "Audi RS5",
    year: 2023,
    price: 24800000,
    status: "reserved",
    createdAt: "2025-05-11",
  },
  {
    id: "4",
    title: "2020 Porsche 911 Carrera S",
    makeModel: "Porsche 911",
    year: 2020,
    price: 32500000,
    status: "sold",
    createdAt: "2025-02-27",
  },
  {
    id: "5",
    title: "2024 Range Rover Sport",
    makeModel: "Range Rover Sport",
    year: 2024,
    price: 29900000,
    status: "pending_review",
    createdAt: "2025-06-01",
  },
  {
    id: "6",
    title: "2019 Lexus RC F",
    makeModel: "Lexus RC F",
    year: 2019,
    price: 15300000,
    status: "draft",
    createdAt: "2025-06-08",
  },
];

export type MockLeadType =
  "car_inquiry" | "service_inquiry" | "trade_in" | "financing" | "general";
export type MockLeadStatus =
  "new" | "contacted" | "qualified" | "converted" | "lost";

export type MockLead = {
  id: string;
  name: string;
  contact: string;
  type: MockLeadType;
  status: MockLeadStatus;
  assignedTo: string | null;
  createdAt: string;
};

export const mockLeads: MockLead[] = [
  {
    id: "1",
    name: "Hamza Sheikh",
    contact: "hamza.sheikh@example.com",
    type: "car_inquiry",
    status: "new",
    assignedTo: null,
    createdAt: "2025-06-10",
  },
  {
    id: "2",
    name: "Zainab Riaz",
    contact: "+92 301 2345678",
    type: "trade_in",
    status: "contacted",
    assignedTo: "Sara Malik",
    createdAt: "2025-06-09",
  },
  {
    id: "3",
    name: "Omar Farooq",
    contact: "omar.farooq@example.com",
    type: "financing",
    status: "qualified",
    assignedTo: "Bilal Ahmed",
    createdAt: "2025-06-07",
  },
  {
    id: "4",
    name: "Mariam Iqbal",
    contact: "+92 333 8765432",
    type: "service_inquiry",
    status: "converted",
    assignedTo: "Sara Malik",
    createdAt: "2025-06-03",
  },
  {
    id: "5",
    name: "Danish Aziz",
    contact: "danish.aziz@example.com",
    type: "general",
    status: "lost",
    assignedTo: null,
    createdAt: "2025-05-29",
  },
];

export type MockGalleryImage = {
  id: string;
  category: "cars" | "showroom" | "deliveries" | "events";
  caption: string;
};

export const mockGalleryImages: MockGalleryImage[] = [
  { id: "1", category: "cars", caption: "BMW M4 — front three-quarter" },
  { id: "2", category: "cars", caption: "Porsche 911 — interior detail" },
  { id: "3", category: "showroom", caption: "Showroom floor, evening" },
  { id: "4", category: "showroom", caption: "Reception & lounge area" },
  { id: "5", category: "deliveries", caption: "Key handover — RS5" },
  { id: "6", category: "deliveries", caption: "Client delivery day" },
  { id: "7", category: "events", caption: "Cars & Coffee meetup" },
  { id: "8", category: "events", caption: "Anniversary showcase" },
];

export const mockStats = {
  totalCars: 48,
  publishedCars: 36,
  totalUsers: 5,
  totalLeads: 132,
  newLeadsThisWeek: 14,
  galleryImages: 87,
};

export const mockLeadsByMonth = [
  { month: "Jan", count: 18 },
  { month: "Feb", count: 22 },
  { month: "Mar", count: 15 },
  { month: "Apr", count: 27 },
  { month: "May", count: 31 },
  { month: "Jun", count: 19 },
];

export const mockLeadsByStatus: { label: string; count: number }[] = [
  { label: "New", count: 38 },
  { label: "Contacted", count: 29 },
  { label: "Qualified", count: 21 },
  { label: "Converted", count: 34 },
  { label: "Lost", count: 10 },
];

export const mockRecentActivity = [
  {
    id: "1",
    actor: "Bilal Ahmed",
    action: "published a new listing",
    target: "2022 BMW M4 Competition",
    time: "2 hours ago",
  },
  {
    id: "2",
    actor: "Sara Malik",
    action: "marked lead as converted",
    target: "Mariam Iqbal",
    time: "5 hours ago",
  },
  {
    id: "3",
    actor: "Ayesha Khan",
    action: "invited a new employee",
    target: "usman@hkmotors.com",
    time: "1 day ago",
  },
  {
    id: "4",
    actor: "Bilal Ahmed",
    action: "updated vehicle status to reserved",
    target: "2023 Audi RS5 Sportback",
    time: "1 day ago",
  },
  {
    id: "5",
    actor: "Sara Malik",
    action: "uploaded 6 photos",
    target: "Gallery — Events",
    time: "2 days ago",
  },
];
