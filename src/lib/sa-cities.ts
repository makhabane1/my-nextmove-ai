/** Client-safe South African city cost benchmarks that feed the simulation prompt. */

export type CityCost = {
  city: string;
  province: string;
  rent: number;
  transport: number;
  food: number;
  salaryLow: number;
  salaryHigh: number;
};

export const SA_CITIES: CityCost[] = [
  { city: "Cape Town", province: "Western Cape", rent: 9500, transport: 1600, food: 3500, salaryLow: 18000, salaryHigh: 32000 },
  { city: "Johannesburg", province: "Gauteng", rent: 8000, transport: 2000, food: 3300, salaryLow: 20000, salaryHigh: 38000 },
  { city: "Pretoria", province: "Gauteng", rent: 7000, transport: 1700, food: 3100, salaryLow: 18000, salaryHigh: 30000 },
  { city: "Durban", province: "KwaZulu-Natal", rent: 6500, transport: 1500, food: 3000, salaryLow: 16000, salaryHigh: 27000 },
  { city: "Stellenbosch", province: "Western Cape", rent: 8500, transport: 1200, food: 3300, salaryLow: 16000, salaryHigh: 28000 },
  { city: "Gqeberha", province: "Eastern Cape", rent: 5800, transport: 1400, food: 2900, salaryLow: 14000, salaryHigh: 25000 },
  { city: "East London", province: "Eastern Cape", rent: 5200, transport: 1300, food: 2800, salaryLow: 13500, salaryHigh: 23000 },
  { city: "Bloemfontein", province: "Free State", rent: 5500, transport: 1300, food: 2800, salaryLow: 14000, salaryHigh: 24000 },
  { city: "Polokwane", province: "Limpopo", rent: 5400, transport: 1400, food: 2800, salaryLow: 13500, salaryHigh: 23000 },
  { city: "Mbombela", province: "Mpumalanga", rent: 5600, transport: 1400, food: 2900, salaryLow: 13500, salaryHigh: 23000 },
  { city: "Kimberley", province: "Northern Cape", rent: 5000, transport: 1200, food: 2700, salaryLow: 13000, salaryHigh: 22000 },
  { city: "Rustenburg", province: "North West", rent: 5600, transport: 1500, food: 2900, salaryLow: 14000, salaryHigh: 26000 },
];

export const findCity = (name: string) =>
  SA_CITIES.find((c) => c.city.toLowerCase() === name.trim().toLowerCase());

/** A plain-language line of local benchmarks the AI can anchor its numbers on. */
export function cityContextLine(name: string): string {
  const c = findCity(name);
  if (!c) return "";
  return `I'm based in ${c.city}, ${c.province}. Local monthly benchmarks to use: typical one-bedroom rent about R${c.rent.toLocaleString("en-ZA")}, transport about R${c.transport.toLocaleString("en-ZA")}, food about R${c.food.toLocaleString("en-ZA")}, and typical take-home for an early-career role between R${c.salaryLow.toLocaleString("en-ZA")} and R${c.salaryHigh.toLocaleString("en-ZA")}.`;
}
