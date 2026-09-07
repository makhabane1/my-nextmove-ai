/** Client-safe mentor directory for the NextMove mentor marketplace. */

export const MENTOR_CATEGORIES = [
  "Career Coaches",
  "Entrepreneurs",
  "Financial Advisors",
  "University Students",
  "Real Estate Experts",
  "Tech Professionals",
  "International Relocation Experts",
] as const;

export type MentorCategory = (typeof MENTOR_CATEGORIES)[number];

export type Mentor = {
  id: string;
  name: string;
  category: MentorCategory;
  expertise: string;
  city: string;
  province: string;
  years: number;
  rating: number;
  reviews: number;
  helped: number;
  bio: string;
  pricePerSession: number;
  availability: "Available this week" | "Booked until next week" | "Limited slots";
  languages: string[];
  slots: string[];
};

const slotsA = ["Tue 17:00", "Wed 18:30", "Thu 12:00", "Sat 09:00"];
const slotsB = ["Mon 07:30", "Wed 13:00", "Fri 16:00"];
const slotsC = ["Tue 19:00", "Thu 18:00", "Sun 10:00"];

export const MENTORS: Mentor[] = [
  {
    id: "thabo-nkosi",
    name: "Thabo Nkosi",
    category: "Tech Professionals",
    expertise: "Software engineering · Backend & cloud",
    city: "Cape Town",
    province: "Western Cape",
    years: 9,
    rating: 4.9,
    reviews: 68,
    helped: 210,
    bio: "Senior engineer at a Cape Town fintech. Self-taught, started on a TVET certificate. I help people go from zero code to a first junior role without paying for an expensive bootcamp.",
    pricePerSession: 450,
    availability: "Available this week",
    languages: ["English", "isiZulu"],
    slots: slotsA,
  },
  {
    id: "naledi-mokoena",
    name: "Naledi Mokoena",
    category: "Career Coaches",
    expertise: "Career changes · Interviews · CVs",
    city: "Johannesburg",
    province: "Gauteng",
    years: 12,
    rating: 4.8,
    reviews: 143,
    helped: 520,
    bio: "Ex-recruiter turned career coach. I have sat on the hiring side of hundreds of SA interviews and I will tell you honestly what is keeping your CV out of the pile.",
    pricePerSession: 380,
    availability: "Limited slots",
    languages: ["English", "Sesotho"],
    slots: slotsB,
  },
  {
    id: "riaan-de-villiers",
    name: "Riaan de Villiers",
    category: "Financial Advisors",
    expertise: "Budgeting · Debt · Emergency funds",
    city: "Stellenbosch",
    province: "Western Cape",
    years: 15,
    rating: 4.7,
    reviews: 91,
    helped: 340,
    bio: "Independent financial planner. I work mostly with people earning their first real salary: store accounts, black tax, tax-free savings and building three months of runway.",
    pricePerSession: 500,
    availability: "Available this week",
    languages: ["English", "Afrikaans"],
    slots: slotsC,
  },
  {
    id: "zanele-dube",
    name: "Zanele Dube",
    category: "Entrepreneurs",
    expertise: "Small business · Side hustles · CIPC & SARS",
    city: "Durban",
    province: "KwaZulu-Natal",
    years: 8,
    rating: 4.9,
    reviews: 77,
    helped: 260,
    bio: "I run two businesses in Durban, one product and one service. I help people start small with real numbers instead of quitting their job on a hope.",
    pricePerSession: 400,
    availability: "Available this week",
    languages: ["English", "isiZulu"],
    slots: slotsA,
  },
  {
    id: "sipho-maluleke",
    name: "Sipho Maluleke",
    category: "University Students",
    expertise: "NSFAS · Applications · Res life",
    city: "Pretoria",
    province: "Gauteng",
    years: 3,
    rating: 4.6,
    reviews: 54,
    helped: 180,
    bio: "Third-year BCom student on NSFAS. I walk matriculants and returning students through applications, funding appeals, res versus digs and surviving on an allowance.",
    pricePerSession: 150,
    availability: "Available this week",
    languages: ["English", "Xitsonga"],
    slots: slotsB,
  },
  {
    id: "aisha-patel",
    name: "Aisha Patel",
    category: "Real Estate Experts",
    expertise: "Renting · First-time buying · Bonds",
    city: "Johannesburg",
    province: "Gauteng",
    years: 11,
    rating: 4.7,
    reviews: 62,
    helped: 200,
    bio: "Property agent and landlord. Deposits, agent fees, levies, transfer costs and which suburbs actually work on an entry-level salary.",
    pricePerSession: 420,
    availability: "Booked until next week",
    languages: ["English"],
    slots: slotsC,
  },
  {
    id: "kagiso-mabaso",
    name: "Kagiso Mabaso",
    category: "International Relocation Experts",
    expertise: "Work visas · Studying abroad · Remote work",
    city: "Cape Town",
    province: "Western Cape",
    years: 7,
    rating: 4.8,
    reviews: 49,
    helped: 150,
    bio: "I moved from Mahikeng to Berlin and back. Honest costs of leaving: visas, proof of funds, flights, first-month deposits and what you give up.",
    pricePerSession: 550,
    availability: "Limited slots",
    languages: ["English", "Setswana"],
    slots: slotsA,
  },
  {
    id: "lerato-khumalo",
    name: "Lerato Khumalo",
    category: "Tech Professionals",
    expertise: "Data analysis · Excel to Python · Portfolios",
    city: "Gqeberha",
    province: "Eastern Cape",
    years: 6,
    rating: 4.9,
    reviews: 58,
    helped: 190,
    bio: "Data analyst who started in a call centre. If you are good with spreadsheets, I will show you the shortest realistic path into a data role in South Africa.",
    pricePerSession: 350,
    availability: "Available this week",
    languages: ["English", "isiXhosa"],
    slots: slotsB,
  },
  {
    id: "jaco-fourie",
    name: "Jaco Fourie",
    category: "Entrepreneurs",
    expertise: "Trades · Franchises · Cash-flow",
    city: "Bloemfontein",
    province: "Free State",
    years: 18,
    rating: 4.5,
    reviews: 40,
    helped: 120,
    bio: "Built a plumbing business from one bakkie. Practical advice on pricing, quoting, staff and surviving a slow month.",
    pricePerSession: 300,
    availability: "Available this week",
    languages: ["English", "Afrikaans"],
    slots: slotsC,
  },
  {
    id: "nomvula-sithole",
    name: "Nomvula Sithole",
    category: "Career Coaches",
    expertise: "Public sector · Nursing & teaching paths",
    city: "Polokwane",
    province: "Limpopo",
    years: 10,
    rating: 4.7,
    reviews: 51,
    helped: 175,
    bio: "I help people navigate government posts, bursaries and professional registration without wasting years on the wrong qualification.",
    pricePerSession: 280,
    availability: "Limited slots",
    languages: ["English", "Sepedi"],
    slots: slotsA,
  },
];

export const findMentor = (id: string) => MENTORS.find((m) => m.id === id);

export const zarPrice = (n: number) => "R" + n.toLocaleString("en-ZA");

export const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/** Compact directory the AI matcher reasons over (kept small and factual). */
export const mentorDirectoryForAi = () =>
  MENTORS.map(
    (m) =>
      `${m.id} | ${m.name} | ${m.category} | ${m.expertise} | ${m.city} | ${m.years}y experience | R${m.pricePerSession} per session`,
  ).join("\n");
