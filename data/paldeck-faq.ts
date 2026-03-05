export interface FAQItem {
  question: string;
  answer: string;
}

export const PALDECK_FAQ: FAQItem[] = [
  {
    question: "What is the Paldeck in Palworld?",
    answer:
      "The Paldeck is an encyclopedia of Pals, including element, work suitability, partner skills, drops, and where you can find them.",
  },
  {
    question: "How many Pals are in this MVP Paldeck seed?",
    answer:
      "This MVP ships with a 60-entry static seed focused on search/filter workflows. The dataset can expand to full coverage in later iterations.",
  },
  {
    question: "What are work suitability levels?",
    answer:
      "Work suitability levels range from 1 to 4. Higher levels indicate stronger efficiency for that specific work type.",
  },
  {
    question: "Can I filter Pals by element type?",
    answer:
      "Yes. The element filter supports multi-select across Fire, Water, Grass, Electric, Ice, Ground, Dark, Dragon, and Neutral.",
  },
  {
    question: "Can I filter by work type?",
    answer:
      "Yes. Work-type filters are multi-select and match Pals that have any selected work suitability.",
  },
  {
    question: "What does rarity help with?",
    answer:
      "Rarity filters help narrow broad results quickly when you are targeting early progression or high-end breeding/boss lines.",
  },
  {
    question: "Are dual-element Pals supported?",
    answer:
      "Yes. Some entries include a secondary element, and element filtering matches either primary or secondary element.",
  },
  {
    question: "Are partner skills and drop tables final?",
    answer:
      "Not yet. MVP data is seed-quality and designed for UI and discovery workflows; values can be refined with future data updates.",
  },
  {
    question: "Does this page support sorting?",
    answer:
      "Yes. You can sort by Paldeck number, name, and rarity in both ascending and descending modes.",
  },
  {
    question: "How do I reset everything quickly?",
    answer:
      "Use Clear all to reset search, elements, work types, rarity, and min work level to defaults.",
  },
];
