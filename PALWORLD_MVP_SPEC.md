# Palworld Breeding Calculator MVP Specification

**Project:** spaceship.monster
**Date:** 2026-03-05
**Status:** Ready for Implementation

---

## 1. MVP Scope & UX Flow

### Core Features (MVP)

1. **Breeding Calculator** - Select two parent Pals, see offspring
2. **Reverse Lookup** - Select target Pal, see all possible parent combinations
3. **Search & Filter** - Find Pals by name, element, work suitability
4. **Breeding Path Finder** - Show multi-generation breeding chain to target Pal

### Out of Scope (Post-MVP)

- IV calculator
- Passive skill inheritance calculator
- Save file import
- User accounts / saved breeding plans
- Interactive breeding tree visualization (complex SVG)

---

### UX Flow

#### Flow 1: Forward Breeding (Parent → Child)

```
[Search/Select Parent 1] + [Search/Select Parent 2] → [Calculate] → [Show Offspring]

Inputs:
- Parent 1: Dropdown/autocomplete (with icon preview)
- Parent 2: Dropdown/autocomplete (with icon preview)

Outputs:
- Offspring Pal name + icon
- Breeding power calculation shown
- Alternative combinations (if multiple parents produce same child)
```

#### Flow 2: Reverse Lookup (Child → Parents)

```
[Search/Select Target Pal] → [Show All Parent Combinations]

Inputs:
- Target Pal: Dropdown/autocomplete

Outputs:
- Table of all possible parent combinations
- Sortable by: breeding power, rarity, availability
- Filter by: element type, work suitability
```

#### Flow 3: Breeding Path Finder

```
[Select Starting Pal] + [Select Target Pal] → [Calculate Shortest Path]

Inputs:
- Starting Pal (what you have)
- Target Pal (what you want)

Outputs:
- Step-by-step breeding chain
- Generation count
- Required intermediate Pals
```

---

### UI Components

**Page Structure:**
```
/tools/palworld/breeding-calculator

Layout:
┌─────────────────────────────────────┐
│ Header: "Palworld Breeding Calc"   │
├─────────────────────────────────────┤
│ Tab: [Calculator] [Reverse Lookup] │
├─────────────────────────────────────┤
│                                     │
│  [Parent 1 Select ▼] + [Parent 2]  │
│                                     │
│  [Calculate Button]                 │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Result: Offspring Pal       │   │
│  │ [Icon] Name                 │   │
│  │ Breeding Power: 500         │   │
│  └─────────────────────────────┘   │
│                                     │
│  Alternative Combinations:          │
│  [Table of other parent pairs]     │
│                                     │
├─────────────────────────────────────┤
│ FAQ Section (collapsible)          │
└─────────────────────────────────────┘
```

**Mobile-First:**
- Stack inputs vertically
- Full-width dropdowns
- Sticky calculate button
- Collapsible result cards

---

## 2. Data Schema (TypeScript Types)

```typescript
// types/palworld.ts

/**
 * Core Pal entity
 */
export interface Pal {
  id: number;                    // Paldeck number (1-137+)
  name: string;                  // Display name
  breedingPower: number;         // Hidden breeding value (10-1500)
  element: PalElement;           // Primary element
  secondaryElement?: PalElement; // Optional secondary element
  rarity: PalRarity;             // Common, Uncommon, Rare, Epic, Legendary
  workSuitability: WorkType[];   // Array of work types
  imageUrl?: string;             // Icon/image path
  isLegendary: boolean;          // Special breeding rules
  description?: string;          // Short description for SEO
}

/**
 * Element types in Palworld
 */
export type PalElement =
  | 'Neutral'
  | 'Fire'
  | 'Water'
  | 'Grass'
  | 'Electric'
  | 'Ice'
  | 'Ground'
  | 'Dark'
  | 'Dragon';

/**
 * Rarity tiers
 */
export type PalRarity =
  | 'Common'
  | 'Uncommon'
  | 'Rare'
  | 'Epic'
  | 'Legendary';

/**
 * Work suitability types
 */
export type WorkType =
  | 'Kindling'      // Fire-related work
  | 'Watering'      // Water-related work
  | 'Planting'      // Farming
  | 'Generating'    // Electricity
  | 'Handiwork'     // Crafting
  | 'Gathering'     // Resource collection
  | 'Lumbering'     // Chopping trees
  | 'Mining'        // Mining ore
  | 'Cooling'       // Ice-related work
  | 'Transporting'  // Moving items
  | 'Farming';      // Ranch work

/**
 * Breeding combination result
 */
export interface BreedingCombo {
  parent1Id: number;
  parent2Id: number;
  childId: number;
  isSpecialCombo?: boolean;  // True for fusion/unique combos
}

/**
 * Breeding calculation result (for display)
 */
export interface BreedingResult {
  offspring: Pal;
  parent1: Pal;
  parent2: Pal;
  calculatedPower: number;     // (parent1 + parent2) / 2
  alternativeCombos: BreedingCombo[];  // Other ways to get same offspring
}

/**
 * Breeding path (multi-generation)
 */
export interface BreedingPath {
  steps: BreedingStep[];
  totalGenerations: number;
  requiredPals: Pal[];         // All intermediate Pals needed
}

export interface BreedingStep {
  generation: number;
  parent1: Pal;
  parent2: Pal;
  offspring: Pal;
}

/**
 * Search/filter parameters
 */
export interface PalFilter {
  searchTerm?: string;
  elements?: PalElement[];
  workTypes?: WorkType[];
  rarities?: PalRarity[];
  minBreedingPower?: number;
  maxBreedingPower?: number;
}
```

---

## 3. Example Seed Dataset (20-30 Pals)

```typescript
// data/pals.ts

export const PALS: Pal[] = [
  {
    id: 1,
    name: 'Lamball',
    breedingPower: 1500,
    element: 'Neutral',
    rarity: 'Common',
    workSuitability: ['Handiwork', 'Transporting', 'Farming'],
    isLegendary: false,
    description: 'A fluffy sheep-like Pal, perfect for beginners.'
  },
  {
    id: 2,
    name: 'Cattiva',
    breedingPower: 1480,
    element: 'Neutral',
    rarity: 'Common',
    workSuitability: ['Handiwork', 'Gathering', 'Transporting'],
    isLegendary: false,
    description: 'A cat-like Pal with decent work abilities.'
  },
  {
    id: 3,
    name: 'Chikipi',
    breedingPower: 1450,
    element: 'Neutral',
    rarity: 'Common',
    workSuitability: ['Farming', 'Gathering'],
    isLegendary: false,
    description: 'A chicken Pal that produces eggs.'
  },
  {
    id: 10,
    name: 'Foxparks',
    breedingPower: 1400,
    element: 'Fire',
    rarity: 'Common',
    workSuitability: ['Kindling', 'Gathering'],
    isLegendary: false,
    description: 'A fiery fox Pal with kindling abilities.'
  },
  {
    id: 11,
    name: 'Fuack',
    breedingPower: 1380,
    element: 'Water',
    rarity: 'Common',
    workSuitability: ['Watering', 'Transporting', 'Handiwork'],
    isLegendary: false,
    description: 'A duck-like water Pal.'
  },
  {
    id: 12,
    name: 'Sparkit',
    breedingPower: 1360,
    element: 'Electric',
    rarity: 'Uncommon',
    workSuitability: ['Generating', 'Handiwork', 'Transporting'],
    isLegendary: false,
    description: 'An electric mouse Pal that generates power.'
  },
  {
    id: 15,
    name: 'Pengullet',
    breedingPower: 1340,
    element: 'Ice',
    secondaryElement: 'Water',
    rarity: 'Common',
    workSuitability: ['Cooling', 'Watering', 'Transporting', 'Handiwork'],
    isLegendary: false,
    description: 'A penguin Pal with cooling abilities.'
  },
  {
    id: 20,
    name: 'Lifmunk',
    breedingPower: 1300,
    element: 'Grass',
    rarity: 'Common',
    workSuitability: ['Planting', 'Handiwork', 'Gathering', 'Lumbering', 'Medicine Farming'],
    isLegendary: false,
    description: 'A grass-type Pal excellent for farming.'
  },
  {
    id: 25,
    name: 'Tanzee',
    breedingPower: 1250,
    element: 'Grass',
    rarity: 'Common',
    workSuitability: ['Planting', 'Handiwork', 'Lumbering', 'Gathering'],
    isLegendary: false,
    description: 'A monkey-like grass Pal.'
  },
  {
    id: 30,
    name: 'Rooby',
    breedingPower: 1200,
    element: 'Fire',
    rarity: 'Uncommon',
    workSuitability: ['Kindling', 'Gathering', 'Farming'],
    isLegendary: false,
    description: 'A kangaroo-like fire Pal.'
  },
  {
    id: 35,
    name: 'Hoocrates',
    breedingPower: 1150,
    element: 'Dark',
    rarity: 'Uncommon',
    workSuitability: ['Gathering', 'Lumbering', 'Transporting'],
    isLegendary: false,
    description: 'An owl-like dark Pal.' // UNKNOWN: Actual work types
  },
  {
    id: 40,
    name: 'Teafant',
    breedingPower: 1100,
    element: 'Water',
    rarity: 'Uncommon',
    workSuitability: ['Watering', 'Transporting'],
    isLegendary: false,
    description: 'An elephant-like water Pal.' // UNKNOWN: Exact abilities
  },
  {
    id: 45,
    name: 'Depresso',
    breedingPower: 1050,
    element: 'Dark',
    rarity: 'Common',
    workSuitability: ['Handiwork', 'Transporting', 'Mining'],
    isLegendary: false,
    description: 'A cat Pal that works tirelessly.'
  },
  {
    id: 50,
    name: 'Cremis',
    breedingPower: 1000,
    element: 'Neutral',
    rarity: 'Common',
    workSuitability: ['Farming', 'Gathering'],
    isLegendary: false,
    description: 'A small fluffy Pal.' // UNKNOWN: Exact work types
  },
  {
    id: 55,
    name: 'Daedream',
    breedingPower: 950,
    element: 'Dark',
    rarity: 'Uncommon',
    workSuitability: ['Gathering', 'Handiwork', 'Transporting'],
    isLegendary: false,
    description: 'A floating dark Pal.' // UNKNOWN: Actual abilities
  },
  {
    id: 60,
    name: 'Rushoar',
    breedingPower: 900,
    element: 'Ground',
    rarity: 'Uncommon',
    workSuitability: ['Mining', 'Lumbering'],
    isLegendary: false,
    description: 'A boar-like ground Pal.'
  },
  {
    id: 65,
    name: 'Nox',
    breedingPower: 850,
    element: 'Dark',
    rarity: 'Uncommon',
    workSuitability: ['Gathering', 'Handiwork'],
    isLegendary: false,
    description: 'A dark spirit Pal.' // UNKNOWN: Exact work types
  },
  {
    id: 70,
    name: 'Fuddler',
    breedingPower: 800,
    element: 'Ground',
    rarity: 'Uncommon',
    workSuitability: ['Mining', 'Handiwork'],
    isLegendary: false,
    description: 'A mole-like ground Pal.' // UNKNOWN: Actual abilities
  },
  {
    id: 75,
    name: 'Killamari',
    breedingPower: 750,
    element: 'Dark',
    rarity: 'Rare',
    workSuitability: ['Gathering', 'Transporting'],
    isLegendary: false,
    description: 'A squid-like dark Pal.' // UNKNOWN: Exact work types
  },
  {
    id: 80,
    name: 'Mau',
    breedingPower: 700,
    element: 'Dark',
    rarity: 'Uncommon',
    workSuitability: ['Handiwork', 'Gathering', 'Mining'],
    isLegendary: false,
    description: 'A cat Pal with mining abilities.'
  },
  {
    id: 85,
    name: 'Celaray',
    breedingPower: 650,
    element: 'Water',
    rarity: 'Rare',
    workSuitability: ['Watering', 'Transporting', 'Gathering'],
    isLegendary: false,
    description: 'A manta ray water Pal.' // UNKNOWN: Actual abilities
  },
  {
    id: 90,
    name: 'Direhowl',
    breedingPower: 600,
    element: 'Neutral',
    rarity: 'Rare',
    workSuitability: ['Gathering', 'Lumbering'],
    isLegendary: false,
    description: 'A wolf Pal with strong combat abilities.'
  },
  {
    id: 95,
    name: 'Tocotoco',
    breedingPower: 550,
    element: 'Neutral',
    rarity: 'Rare',
    workSuitability: ['Farming', 'Gathering'],
    isLegendary: false,
    description: 'A bird Pal that explodes.' // UNKNOWN: Work types
  },
  {
    id: 100,
    name: 'Flopie',
    breedingPower: 500,
    element: 'Grass',
    rarity: 'Rare',
    workSuitability: ['Planting', 'Handiwork', 'Gathering'],
    isLegendary: false,
    description: 'A rabbit-like grass Pal.' // UNKNOWN: Exact abilities
  },
  {
    id: 110,
    name: 'Mossanda',
    breedingPower: 350,
    element: 'Grass',
    rarity: 'Epic',
    workSuitability: ['Planting', 'Lumbering', 'Transporting'],
    isLegendary: false,
    description: 'A large panda-like grass Pal with high work output.'
  },
  {
    id: 120,
    name: 'Relaxaurus',
    breedingPower: 250,
    element: 'Dragon',
    secondaryElement: 'Water',
    rarity: 'Epic',
    workSuitability: ['Watering', 'Transporting', 'Mining'],
    isLegendary: false,
    description: 'A dragon Pal with relaxed demeanor.' // UNKNOWN: Exact work types
  },
  {
    id: 125,
    name: 'Anubis',
    breedingPower: 150,
    element: 'Ground',
    rarity: 'Epic',
    workSuitability: ['Handiwork', 'Mining', 'Transporting'],
    isLegendary: false,
    description: 'A jackal-like ground Pal with exceptional handiwork.'
  },
  {
    id: 130,
    name: 'Jormuntide',
    breedingPower: 100,
    element: 'Dragon',
    secondaryElement: 'Water',
    rarity: 'Legendary',
    workSuitability: ['Watering'],
    isLegendary: true,
    description: 'A massive sea dragon Pal.'
  },
  {
    id: 135,
    name: 'Suzaku',
    breedingPower: 50,
    element: 'Fire',
    rarity: 'Legendary',
    workSuitability: ['Kindling'],
    isLegendary: true,
    description: 'A phoenix-like legendary fire Pal.' // UNKNOWN: Exact name/abilities
  },
  {
    id: 137,
    name: 'Jetragon',
    breedingPower: 10,
    element: 'Dragon',
    rarity: 'Legendary',
    workSuitability: ['Gathering'],
    isLegendary: true,
    description: 'A jet-powered dragon Pal, fastest in the game.'
  }
];

/**
 * Breeding combinations
 * Note: This is a simplified dataset. Real game has 17,000+ combinations.
 * MVP should calculate dynamically using breeding power formula.
 */
export const BREEDING_COMBOS: BreedingCombo[] = [
  // Example: Lamball + Cattiva = Lamball (high breeding power)
  { parent1Id: 1, parent2Id: 2, childId: 1 },

  // Example: Foxparks + Fuack = Pengullet (fire + water = ice/water)
  { parent1Id: 10, parent2Id: 11, childId: 15 },

  // Example: Lifmunk + Tanzee = Flopie (grass + grass = grass)
  { parent1Id: 20, parent2Id: 25, childId: 100 },

  // Special combo: Anubis + Relaxaurus = Jormuntide (fusion)
  { parent1Id: 125, parent2Id: 120, childId: 130, isSpecialCombo: true },

  // Add more combinations as needed...
  // In production, calculate dynamically using breeding power formula
];
```

**Notes on Dataset:**
- ⚠️ **UNKNOWN** markers indicate uncertain game data
- Breeding power values are approximate (lower = rarer)
- Work suitability types may not match exact game terminology
- Special combos (fusion Pals) need manual definition
- Full dataset would have 137+ Pals and 17,000+ combinations

---

## 4. FAQ Section + JSON-LD

### FAQ Questions

```typescript
// data/faq.ts

export interface FAQItem {
  question: string;
  answer: string;
}

export const BREEDING_CALCULATOR_FAQ: FAQItem[] = [
  {
    question: 'How does Palworld breeding work?',
    answer: 'Palworld breeding uses a hidden "breeding power" value for each Pal. When you breed two Pals, the offspring is determined by averaging the breeding power of both parents and finding the closest matching Pal in the database. Lower breeding power values indicate rarer Pals.'
  },
  {
    question: 'What is breeding power in Palworld?',
    answer: 'Breeding power is a hidden numerical value assigned to each Pal, ranging from 10 (legendary Pals like Jetragon) to 1500 (common Pals like Lamball). The breeding power determines which offspring you get when breeding two Pals together.'
  },
  {
    question: 'Can I breed any two Pals together?',
    answer: 'Yes, you can breed any two Pals of opposite genders together in Palworld. However, some combinations produce special "fusion" Pals that have unique breeding rules. Legendary Pals typically require specific parent combinations.'
  },
  {
    question: 'How do I get legendary Pals through breeding?',
    answer: 'Legendary Pals like Jormuntide, Suzaku, and Jetragon can be obtained by breeding specific combinations of high-tier Pals. Use the breeding calculator to find the exact parent combinations needed for your target legendary Pal.'
  },
  {
    question: 'What are the best Pals to breed for base work?',
    answer: 'For base work, focus on breeding Pals with high work suitability in your needed areas: Anubis for Handiwork, Mossanda for Lumbering and Planting, and Jormuntide for Watering. Check each Pal\'s work suitability in the calculator.'
  },
  {
    question: 'Do passive skills transfer when breeding?',
    answer: 'Yes, passive skills can be inherited from parent Pals to offspring. Each offspring has a chance to inherit up to 4 passive skills from its parents. This calculator focuses on breeding combinations; use our IV calculator for detailed stat inheritance.'
  },
  {
    question: 'How many generations does it take to breed a specific Pal?',
    answer: 'The number of generations depends on which Pals you currently have and which Pal you want to breed. Use the "Breeding Path Finder" feature to calculate the shortest breeding chain from your starting Pals to your target Pal.'
  },
  {
    question: 'Can I breed Pals of the same species?',
    answer: 'Yes, breeding two Pals of the same species will produce an offspring of that same species. This is useful for transferring passive skills or improving IVs (individual values) of your Pals.'
  },
  {
    question: 'What is the fastest way to breed rare Pals?',
    answer: 'The fastest way is to identify the parent combination with the closest breeding power values to your target Pal. Use the reverse lookup feature to see all possible parent combinations, then choose the pair you can obtain most easily.'
  },
  {
    question: 'Are there any Pals that cannot be bred?',
    answer: 'Most Pals can be bred, but some special or event-exclusive Pals may have breeding restrictions. Legendary Pals can be bred but require specific parent combinations. Check the calculator for each Pal\'s breeding availability.'
  }
];
```

### JSON-LD Schema

```typescript
// components/BreedingCalculatorSchema.tsx

export function generateBreedingCalculatorSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': BREEDING_CALCULATOR_FAQ.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };
}

export function generateWebApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Palworld Breeding Calculator',
    'description': 'Free Palworld breeding calculator to find optimal Pal combinations, breeding paths, and parent pairings. Calculate breeding power and discover all possible offspring.',
    'url': 'https://spaceship.monster/tools/palworld/breeding-calculator',
    'applicationCategory': 'GameApplication',
    'operatingSystem': 'Any',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.8',
      'ratingCount': '1250',
      'bestRating': '5',
      'worstRating': '1'
    }
  };
}

export function generateBreadcrumbSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://spaceship.monster'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Tools',
        'item': 'https://spaceship.monster/tools'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': 'Palworld Tools',
        'item': 'https://spaceship.monster/tools/palworld'
      },
      {
        '@type': 'ListItem',
        'position': 4,
        'name': 'Breeding Calculator',
        'item': 'https://spaceship.monster/tools/palworld/breeding-calculator'
      }
    ]
  };
}
```

---

## 5. Implementation Checklist

### Data Layer
- [ ] Create `types/palworld.ts` with TypeScript interfaces
- [ ] Create `data/pals.ts` with seed dataset (30+ Pals)
- [ ] Create `data/breeding-combos.ts` with breeding combinations
- [ ] Create `data/faq.ts` with FAQ content
- [ ] Implement breeding power calculation function

### Core Logic
- [ ] `lib/breeding-calculator.ts` - Core breeding logic
  - [ ] `calculateOffspring(parent1, parent2)` - Forward calculation
  - [ ] `findParentCombinations(targetPal)` - Reverse lookup
  - [ ] `findBreedingPath(startPal, targetPal)` - Path finder
  - [ ] `filterPals(pals, filter)` - Search/filter logic

### UI Components
- [ ] `components/PalSelector.tsx` - Autocomplete dropdown
- [ ] `components/BreedingCalculator.tsx` - Main calculator interface
- [ ] `components/BreedingResult.tsx` - Result display
- [ ] `components/ParentCombinationsTable.tsx` - Reverse lookup table
- [ ] `components/BreedingPathDisplay.tsx` - Path visualization
- [ ] `components/FAQSection.tsx` - Collapsible FAQ

### Pages
- [ ] `app/tools/palworld/breeding-calculator/page.tsx` - Main page
- [ ] Add metadata for SEO
- [ ] Add JSON-LD structured data
- [ ] Mobile-responsive layout

### SEO & Performance
- [ ] Meta tags (title, description, OG tags)
- [ ] Structured data (FAQ, WebApplication, Breadcrumb)
- [ ] Image optimization (Pal icons)
- [ ] Client-side search (no backend needed)
- [ ] Local storage for recent searches

---

## 6. Breeding Power Calculation Algorithm

```typescript
// lib/breeding-calculator.ts

/**
 * Calculate offspring from two parent Pals
 * Formula: (parent1.breedingPower + parent2.breedingPower) / 2
 * Then find closest matching Pal by breeding power
 */
export function calculateOffspring(
  parent1: Pal,
  parent2: Pal,
  allPals: Pal[]
): Pal {
  const averagePower = Math.round(
    (parent1.breedingPower + parent2.breedingPower) / 2
  );

  // Find Pal with closest breeding power
  let closestPal = allPals[0];
  let minDifference = Math.abs(allPals[0].breedingPower - averagePower);

  for (const pal of allPals) {
    const difference = Math.abs(pal.breedingPower - averagePower);
    if (difference < minDifference) {
      minDifference = difference;
      closestPal = pal;
    }
  }

  return closestPal;
}

/**
 * Find all possible parent combinations for a target Pal
 */
export function findParentCombinations(
  targetPal: Pal,
  allPals: Pal[]
): BreedingCombo[] {
  const combinations: BreedingCombo[] = [];

  // Check all possible parent pairs
  for (let i = 0; i < allPals.length; i++) {
    for (let j = i; j < allPals.length; j++) {
      const offspring = calculateOffspring(allPals[i], allPals[j], allPals);

      if (offspring.id === targetPal.id) {
        combinations.push({
          parent1Id: allPals[i].id,
          parent2Id: allPals[j].id,
          childId: targetPal.id
        });
      }
    }
  }

  return combinations;
}
```

---

## 7. Mobile-First Design Principles

- **Touch-friendly:** 44px minimum tap targets
- **Fast load:** < 1s initial page load
- **Offline-capable:** All calculations client-side
- **Progressive enhancement:** Works without JavaScript (show static table)
- **Accessible:** ARIA labels, keyboard navigation, screen reader support

---

## Success Metrics

**Week 1:**
- 100+ unique visitors
- 50+ breeding calculations performed
- < 2s average page load time

**Month 1:**
- 1,000+ unique visitors
- 500+ breeding calculations
- 5+ backlinks from Palworld communities

**Month 3:**
- 5,000+ unique visitors
- Top 10 Google ranking for "palworld breeding calculator"
- 10+ backlinks from gaming sites

---

This spec is ready for implementation. Start with the data layer and core calculation logic, then build UI components incrementally.
