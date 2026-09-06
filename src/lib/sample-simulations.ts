/** Hand-written example outputs so visitors see real value before typing anything. */

export type SamplePath = {
  letter: string;
  title: string;
  cost: string;
  costLabel: string;
  runway: string;
  risk: "Low" | "Medium" | "High";
  recommendation: string;
};

export type SampleSimulation = {
  key: string;
  starter: string;
  person: string;
  question: string;
  summary: string;
  paths: SamplePath[];
};

export const SAMPLE_SIMULATIONS: SampleSimulation[] = [
  {
    key: "quit",
    starter: "Quit my job",
    person: "Thandi, 24, Durban",
    question: "Quit my job vs. stay",
    summary:
      "Thandi earns R18 500 a month, has R42 000 saved, no dependants and R2 100 of store-account debt. She wants out of a job that is burning her out.",
    paths: [
      {
        letter: "A",
        title: "Stay and stack cash for 6 months",
        cost: "R0",
        costLabel: "once-off cost",
        runway: "7.4 months",
        risk: "Low",
        recommendation:
          "Keeps income, grows savings to about R78 000, and buys you a real safety net. The cost is six more months in a job you dislike.",
      },
      {
        letter: "B",
        title: "Resign with a 3-month freelance pipeline",
        cost: "R14 500",
        costLabel: "setup + first month gap",
        runway: "4.1 months",
        risk: "Medium",
        recommendation:
          "Workable only if two paying clients are signed before you resign. Below R30 000 saved this path gets tight fast.",
      },
      {
        letter: "C",
        title: "Resign now and figure it out",
        cost: "R9 000",
        costLabel: "notice-period gap",
        runway: "2.3 months",
        risk: "High",
        recommendation:
          "Two months of breathing room in a slow SA job market. Possible, but one delayed offer puts you back at your parents' house.",
      },
    ],
  },
  {
    key: "career",
    starter: "Change careers",
    person: "Sipho, 26, Johannesburg",
    question: "Move from retail management into tech support",
    summary:
      "Sipho takes home R21 000, supports his mother with R3 000 a month and has R30 000 saved. He wants a career with room to grow.",
    paths: [
      {
        letter: "A",
        title: "Study part-time while employed",
        cost: "R28 000",
        costLabel: "certification over 12 months",
        runway: "5.8 months",
        risk: "Low",
        recommendation:
          "Slowest but safest. Income and family support stay intact while you build a CompTIA or AWS certificate.",
      },
      {
        letter: "B",
        title: "6-month bootcamp, reduced hours",
        cost: "R52 000",
        costLabel: "fees + income dip",
        runway: "3.2 months",
        risk: "Medium",
        recommendation:
          "Fastest realistic route to a junior tech role at R18k–R25k. Needs an employer who agrees to fewer hours.",
      },
      {
        letter: "C",
        title: "Resign and study full-time",
        cost: "R74 000",
        costLabel: "fees + 6 months living",
        runway: "1.9 months",
        risk: "High",
        recommendation:
          "Your mother's R3 000 has no cover here. Only sensible with a bursary or a second earner in the house.",
      },
    ],
  },
  {
    key: "study",
    starter: "Go study",
    person: "Lerato, 21, Polokwane",
    question: "Study in Cape Town vs. study locally",
    summary:
      "Lerato has R15 000 saved, family can contribute R2 500 a month, and she has been accepted for a three-year degree.",
    paths: [
      {
        letter: "A",
        title: "Study locally, live at home",
        cost: "R58 000",
        costLabel: "year one fees",
        runway: "6.0 months",
        risk: "Low",
        recommendation:
          "No rent, no relocation. Least debt by graduation, smaller professional network while you study.",
      },
      {
        letter: "B",
        title: "Cape Town with NSFAS or a bursary",
        cost: "R31 000",
        costLabel: "gap after funding",
        runway: "3.4 months",
        risk: "Medium",
        recommendation:
          "Strong option if funding is confirmed in writing before you move. Do not sign a lease on a maybe.",
      },
      {
        letter: "C",
        title: "Cape Town self-funded",
        cost: "R148 000",
        costLabel: "fees + res + living, year one",
        runway: "0.8 months",
        risk: "High",
        recommendation:
          "Cape Town rent and res push this far beyond your savings. Would need a loan and a part-time job from month one.",
      },
    ],
  },
];

export const sampleFor = (key: string) =>
  SAMPLE_SIMULATIONS.find((s) => s.key === key) ?? SAMPLE_SIMULATIONS[0]!;
