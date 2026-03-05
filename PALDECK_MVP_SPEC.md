# Paldeck MVP Content + Data Specification

**Project:** spaceship.monster
**Date:** 2026-03-05
**Status:** Ready for Implementation

---

## 1. Minimal Data Schema (TypeScript)

```typescript
// types/paldeck.ts

/**
 * Core Pal entity for Paldeck database
 */
export interface PaldeckEntry {
  id: number;                          // Paldeck number (001-137+)
  name: string;                        // Display name
  element: PalElement;                 // Primary element
  secondaryElement?: PalElement;       // Optional secondary element
  rarity: PalRarity;                   // Rarity tier
  workSuitability: WorkSuitability[];  // Work types with levels
  partnerSkill?: PartnerSkill;         // Optional partner skill
  drops?: ItemDrop[];                  // Optional item drops
  imageUrl?: string;                   // Icon/sprite path
  description: string;                 // Short description (1-2 sentences)
  location?: string;                   // Where to find (optional)
  breedingPower?: number;              // For breeding calculator integration
}

/**
 * Element types
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
 * Work suitability with level
 */
export interface WorkSuitability {
  type: WorkType;
  level: 1 | 2 | 3 | 4;  // Work efficiency level
}

/**
 * Work types
 */
export type WorkType =
  | 'Kindling'
  | 'Watering'
  | 'Planting'
  | 'Generating'
  | 'Handiwork'
  | 'Gathering'
  | 'Lumbering'
  | 'Mining'
  | 'Cooling'
  | 'Transporting'
  | 'Farming';

/**
 * Partner skill (active ability when in party)
 */
export interface PartnerSkill {
  name: string;
  description: string;
}

/**
 * Item drops when defeated/butchered
 */
export interface ItemDrop {
  item: string;
  quantity?: string;  // e.g., "1-3", "5-10"
  dropRate?: 'Common' | 'Uncommon' | 'Rare';
}

/**
 * Filter parameters for Paldeck search
 */
export interface PaldeckFilter {
  searchTerm?: string;              // Name search
  elements?: PalElement[];          // Filter by element(s)
  workTypes?: WorkType[];           // Filter by work type(s)
  rarities?: PalRarity[];           // Filter by rarity
  minWorkLevel?: 1 | 2 | 3 | 4;    // Minimum work level
}

/**
 * Sort options
 */
export type PaldeckSortOption =
  | 'id-asc'           // Paldeck number (ascending)
  | 'id-desc'          // Paldeck number (descending)
  | 'name-asc'         // Alphabetical A-Z
  | 'name-desc'        // Alphabetical Z-A
  | 'rarity-asc'       // Common → Legendary
  | 'rarity-desc';     // Legendary → Common
```

---

## 2. Filter UX Specification

### Search & Filter Interface

```
┌─────────────────────────────────────────────────┐
│ Paldeck - Complete Pal Database                │
├─────────────────────────────────────────────────┤
│                                                 │
│ [🔍 Search by name...]                         │
│                                                 │
│ Filters:                                        │
│ ┌─────────────────────────────────────────┐   │
│ │ Element:                                 │   │
│ │ [All] [Fire] [Water] [Grass] [Electric] │   │
│ │ [Ice] [Ground] [Dark] [Dragon] [Neutral]│   │
│ └─────────────────────────────────────────┘   │
│                                                 │
│ ┌─────────────────────────────────────────┐   │
│ │ Work Type:                               │   │
│ │ [All] [Kindling] [Watering] [Planting]  │   │
│ │ [Handiwork] [Mining] [Lumbering]        │   │
│ │ [Gathering] [Transporting] [Farming]    │   │
│ └─────────────────────────────────────────┘   │
│                                                 │
│ ┌─────────────────────────────────────────┐   │
│ │ Rarity:                                  │   │
│ │ [All] [Common] [Uncommon] [Rare]        │   │
│ │ [Epic] [Legendary]                       │   │
│ └─────────────────────────────────────────┘   │
│                                                 │
│ Sort by: [Paldeck # ▼]                         │
│                                                 │
│ [Clear Filters]                                 │
│                                                 │
├─────────────────────────────────────────────────┤
│ Results: 137 Pals                               │
├─────────────────────────────────────────────────┤
│                                                 │
│ ┌─────────────────────────────────────────┐   │
│ │ #001 Lamball          [Neutral] Common  │   │
│ │ [Icon]                                   │   │
│ │ Work: Handiwork Lv1, Transporting Lv1  │   │
│ │ A fluffy sheep-like Pal...              │   │
│ │ [View Details →]                         │   │
│ └─────────────────────────────────────────┘   │
│                                                 │
│ ┌─────────────────────────────────────────┐   │
│ │ #010 Foxparks         [Fire] Common     │   │
│ │ [Icon]                                   │   │
│ │ Work: Kindling Lv1, Gathering Lv1      │   │
│ │ A fiery fox Pal...                      │   │
│ │ [View Details →]                         │   │
│ └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Filter Behavior

**Search by Name:**
- Real-time search (debounced 300ms)
- Case-insensitive
- Matches partial names (e.g., "fox" matches "Foxparks")
- Clear button to reset search

**Filter by Element:**
- Multi-select (can select multiple elements)
- Shows count badge (e.g., "Fire (23)")
- "All" button clears element filters
- Mobile: Horizontal scrollable chips

**Filter by Work Suitability:**
- Multi-select (can select multiple work types)
- Shows Pals that have ANY of the selected work types
- Optional: Filter by minimum work level (Lv1-4)
- Shows count badge per work type

**Filter by Rarity:**
- Multi-select
- Visual indicators (color-coded badges)
- Shows count per rarity tier

**Sort Options:**
- Paldeck # (ascending/descending)
- Name (A-Z / Z-A)
- Rarity (Common → Legendary / Legendary → Common)
- Default: Paldeck # ascending

**Active Filters Display:**
```
Active filters: [Fire ×] [Kindling ×] [Rare ×]  Clear all
```

### Mobile Optimizations

- Collapsible filter panel (drawer/accordion)
- Sticky search bar
- Filter chips instead of full buttons
- Infinite scroll or pagination (20 per page)
- Swipeable cards

---

## 3. Seed Dataset Plan

### Approach: 50-100 Entries

**Phase 1: Initial 30 Pals (MVP Launch)**
- Cover all element types (at least 3 per element)
- Cover all work types (at least 2 per work type)
- Include mix of rarities (20 Common, 6 Uncommon, 3 Rare, 1 Epic)
- Focus on early-game and popular Pals

**Phase 2: Expand to 60 Pals (Week 2)**
- Add mid-game Pals
- More Epic and Legendary entries
- Complete work type coverage

**Phase 3: Complete 100+ Pals (Month 1)**
- Full Paldeck coverage
- All variants and special Pals
- Community-requested additions

**Data Sources:**
- Palworld Wiki (community-maintained)
- Game files (if accessible)
- Player submissions (verify before adding)
- Competitor sites (for validation, not copying)

### 10 Example Entries

```typescript
// data/paldeck.ts

export const PALDECK_ENTRIES: PaldeckEntry[] = [
  {
    id: 1,
    name: 'Lamball',
    element: 'Neutral',
    rarity: 'Common',
    workSuitability: [
      { type: 'Handiwork', level: 1 },
      { type: 'Transporting', level: 1 },
      { type: 'Farming', level: 1 }
    ],
    partnerSkill: {
      name: 'Fluffy Shield',
      description: 'Can be used as a shield when held. Reduces damage taken.'
    },
    drops: [
      { item: 'Wool', quantity: '1-3', dropRate: 'Common' },
      { item: 'Lamball Mutton', quantity: '1-2', dropRate: 'Common' }
    ],
    description: 'A fluffy sheep-like Pal perfect for beginners. Docile and easy to care for, making it ideal for base work.',
    location: 'Grasslands (starting area)',
    breedingPower: 1500
  },

  {
    id: 10,
    name: 'Foxparks',
    element: 'Fire',
    rarity: 'Common',
    workSuitability: [
      { type: 'Kindling', level: 1 },
      { type: 'Gathering', level: 1 }
    ],
    partnerSkill: {
      name: 'Huggy Fire',
      description: 'While in team, increases attack power of Fire Pals.'
    },
    drops: [
      { item: 'Flame Organ', quantity: '1-2', dropRate: 'Common' },
      { item: 'Leather', quantity: '1', dropRate: 'Common' }
    ],
    description: 'A fiery fox Pal with kindling abilities. Its tail flame never goes out, making it useful for cooking and smelting.',
    location: 'Grasslands, Forest',
    breedingPower: 1400
  },

  {
    id: 25,
    name: 'Pengullet',
    element: 'Ice',
    secondaryElement: 'Water',
    rarity: 'Common',
    workSuitability: [
      { type: 'Cooling', level: 1 },
      { type: 'Watering', level: 1 },
      { type: 'Transporting', level: 1 },
      { type: 'Handiwork', level: 1 }
    ],
    partnerSkill: {
      name: 'Pengullet Cannon',
      description: 'Can be thrown at enemies. Explodes on impact but Pengullet is unharmed.'
    },
    drops: [
      { item: 'Ice Organ', quantity: '1-2', dropRate: 'Common' },
      { item: 'Pal Fluids', quantity: '1', dropRate: 'Common' }
    ],
    description: 'A penguin Pal with cooling abilities. Surprisingly versatile for base work despite its small size.',
    location: 'Coastline, Frozen areas',
    breedingPower: 1340
  },

  {
    id: 33,
    name: 'Lifmunk',
    element: 'Grass',
    rarity: 'Common',
    workSuitability: [
      { type: 'Planting', level: 2 },
      { type: 'Handiwork', level: 1 },
      { type: 'Gathering', level: 1 },
      { type: 'Lumbering', level: 1 }
    ],
    partnerSkill: {
      name: 'Lifmunk Recoil',
      description: 'While in team, can be summoned and used instead of a glider. Allows for mid-air movement.'
    },
    drops: [
      { item: 'Berry Seeds', quantity: '2-4', dropRate: 'Common' },
      { item: 'Lifmunk Effigy', quantity: '1', dropRate: 'Rare' }
    ],
    description: 'A grass-type Pal excellent for farming. Its planting skills are among the best for early-game agriculture.',
    location: 'Forest, Grasslands',
    breedingPower: 1300
  },

  {
    id: 45,
    name: 'Depresso',
    element: 'Dark',
    rarity: 'Common',
    workSuitability: [
      { type: 'Handiwork', level: 1 },
      { type: 'Transporting', level: 1 },
      { type: 'Mining', level: 1 }
    ],
    partnerSkill: {
      name: 'Caffeine Inoculation',
      description: 'While in team, increases player work speed but decreases SAN value.'
    },
    drops: [
      { item: 'Venom Gland', quantity: '1', dropRate: 'Common' },
      { item: 'Bone', quantity: '1-2', dropRate: 'Common' }
    ],
    description: 'A cat Pal that works tirelessly despite its perpetually tired appearance. Popular for base automation.',
    location: 'Caves, Dark areas',
    breedingPower: 1050
  },

  {
    id: 58,
    name: 'Rushoar',
    element: 'Ground',
    rarity: 'Uncommon',
    workSuitability: [
      { type: 'Mining', level: 2 },
      { type: 'Lumbering', level: 1 }
    ],
    partnerSkill: {
      name: 'Hard Head',
      description: 'Can be ridden. Increases player mining efficiency while mounted.'
    },
    drops: [
      { item: 'Leather', quantity: '2-3', dropRate: 'Common' },
      { item: 'Rushoar Bacon', quantity: '1-2', dropRate: 'Common' }
    ],
    description: 'A boar-like ground Pal with strong mining capabilities. Its hard head can break through rocks easily.',
    location: 'Mountains, Rocky areas',
    breedingPower: 900
  },

  {
    id: 65,
    name: 'Sparkit',
    element: 'Electric',
    rarity: 'Uncommon',
    workSuitability: [
      { type: 'Generating', level: 2 },
      { type: 'Handiwork', level: 1 },
      { type: 'Transporting', level: 1 }
    ],
    partnerSkill: {
      name: 'Static Electricity',
      description: 'While in team, increases Electric attack damage.'
    },
    drops: [
      { item: 'Electric Organ', quantity: '1-3', dropRate: 'Common' },
      { item: 'Pal Fluids', quantity: '1', dropRate: 'Common' }
    ],
    description: 'An electric mouse Pal that generates power. Essential for bases requiring electricity generation.',
    location: 'Grasslands, near power sources',
    breedingPower: 1360
  },

  {
    id: 90,
    name: 'Anubis',
    element: 'Ground',
    rarity: 'Epic',
    workSuitability: [
      { type: 'Handiwork', level: 4 },
      { type: 'Mining', level: 3 },
      { type: 'Transporting', level: 2 }
    ],
    partnerSkill: {
      name: 'Guardian of the Desert',
      description: 'While in team, increases player defense and boosts Ground attack damage.'
    },
    drops: [
      { item: 'Ancient Civilization Parts', quantity: '2-4', dropRate: 'Uncommon' },
      { item: 'Gold Coin', quantity: '1-2', dropRate: 'Rare' }
    ],
    description: 'A jackal-like ground Pal with exceptional handiwork skills. One of the best Pals for crafting and production.',
    location: 'Desert ruins (boss encounter)',
    breedingPower: 150
  },

  {
    id: 110,
    name: 'Mossanda',
    element: 'Grass',
    rarity: 'Epic',
    workSuitability: [
      { type: 'Planting', level: 3 },
      { type: 'Lumbering', level: 3 },
      { type: 'Transporting', level: 3 }
    ],
    partnerSkill: {
      name: 'Grenadier Panda',
      description: 'Can be ridden. Can rapidly fire a grenade launcher while mounted.'
    },
    drops: [
      { item: 'High Quality Cloth', quantity: '3-5', dropRate: 'Common' },
      { item: 'Beautiful Flower', quantity: '2-3', dropRate: 'Uncommon' }
    ],
    description: 'A large panda-like grass Pal with high work output. Excellent for farming and lumber operations.',
    location: 'Deep forest (boss encounter)',
    breedingPower: 350
  },

  {
    id: 137,
    name: 'Jetragon',
    element: 'Dragon',
    rarity: 'Legendary',
    workSuitability: [
      { type: 'Gathering', level: 3 }
    ],
    partnerSkill: {
      name: 'Aerial Missile',
      description: 'Can be ridden as a flying mount. Fastest flying speed in the game. Can fire missiles while mounted.'
    },
    drops: [
      { item: 'Pure Quartz', quantity: '5-8', dropRate: 'Uncommon' },
      { item: 'Carbon Fiber', quantity: '3-5', dropRate: 'Rare' },
      { item: 'Legendary Sphere Schematic', quantity: '1', dropRate: 'Rare' }
    ],
    description: 'A jet-powered dragon Pal, the fastest in the game. Extremely rare and difficult to capture or breed.',
    location: 'Mount Obsidian summit (level 50 boss)',
    breedingPower: 10
  }
];
```

---

## 4. FAQ Questions + JSON-LD

### FAQ Content

```typescript
// data/paldeck-faq.ts

export interface FAQItem {
  question: string;
  answer: string;
}

export const PALDECK_FAQ: FAQItem[] = [
  {
    question: 'What is the Paldeck in Palworld?',
    answer: 'The Paldeck is your encyclopedia of all Pals in Palworld. It tracks which Pals you\'ve encountered, captured, and provides detailed information about each Pal\'s abilities, work suitability, drops, and locations.'
  },
  {
    question: 'How many Pals are in the Paldeck?',
    answer: 'The Paldeck currently contains 137+ unique Pals, including common creatures, rare variants, and legendary Pals. New Pals are added with game updates and expansions.'
  },
  {
    question: 'What are work suitability levels?',
    answer: 'Work suitability levels range from 1 to 4, indicating how efficiently a Pal can perform a specific task. Level 4 is the highest efficiency, making those Pals extremely valuable for base automation. For example, Anubis has Handiwork Level 4, making it one of the best crafting Pals.'
  },
  {
    question: 'Which Pals are best for base work?',
    answer: 'The best base work Pals depend on your needs: Anubis (Handiwork Lv4), Mossanda (Lumbering/Planting Lv3), Jormuntide (Watering Lv4), and Blazamut (Kindling Lv4). Check each Pal\'s work suitability levels in the Paldeck to optimize your base.'
  },
  {
    question: 'How do I find rare and legendary Pals?',
    answer: 'Rare and legendary Pals typically spawn in specific high-level areas or as boss encounters. Check the location information in each Pal\'s Paldeck entry. Some legendary Pals can only be obtained through specific breeding combinations.'
  },
  {
    question: 'What are partner skills?',
    answer: 'Partner skills are special abilities that activate when a Pal is in your active party or when you ride them. These skills provide various benefits like increased damage, movement abilities, or resource gathering bonuses.'
  },
  {
    question: 'Can I filter Pals by element type?',
    answer: 'Yes, use the element filter to view Pals of specific types: Fire, Water, Grass, Electric, Ice, Ground, Dark, Dragon, or Neutral. Some Pals have dual elements, appearing in multiple element categories.'
  },
  {
    question: 'What items do Pals drop?',
    answer: 'Each Pal drops specific items when defeated or butchered. Common drops include materials like leather, organs, and meat. Rare Pals may drop valuable crafting materials, schematics, or unique items. Check each Pal\'s drop table in the Paldeck.'
  },
  {
    question: 'How do I complete my Paldeck?',
    answer: 'To complete your Paldeck, you need to encounter or capture each Pal at least once. Explore all biomes, defeat boss Pals, and use breeding to obtain rare combinations. Some Pals only appear at night or in specific weather conditions.'
  },
  {
    question: 'Are there different Pal variants or forms?',
    answer: 'Yes, some Pals have special variants with different elements or abilities. For example, Mossanda has a Lux variant with Electric typing. These variants are tracked separately in the Paldeck and often require specific breeding or capture methods.'
  }
];
```

### JSON-LD Schema

```typescript
// components/PaldeckSchema.tsx

export function generatePaldeckFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': PALDECK_FAQ.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };
}

export function generatePaldeckWebPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Palworld Paldeck - Complete Pal Database',
    'description': 'Complete Palworld Paldeck database with all Pals, their elements, work suitability, partner skills, drops, and locations. Search and filter by element, work type, and rarity.',
    'url': 'https://spaceship.monster/tools/palworld/paldeck',
    'breadcrumb': {
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
          'name': 'Palworld',
          'item': 'https://spaceship.monster/tools/palworld'
        },
        {
          '@type': 'ListItem',
          'position': 4,
          'name': 'Paldeck',
          'item': 'https://spaceship.monster/tools/palworld/paldeck'
        }
      ]
    }
  };
}

export function generatePaldeckItemListSchema(pals: PaldeckEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'Palworld Paldeck',
    'description': 'Complete list of all Pals in Palworld',
    'numberOfItems': pals.length,
    'itemListElement': pals.slice(0, 20).map((pal, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'Thing',
        'name': pal.name,
        'description': pal.description,
        'image': pal.imageUrl,
        'url': `https://spaceship.monster/tools/palworld/paldeck/${pal.id}`
      }
    }))
  };
}
```

---

## 5. Implementation Checklist

### Data Layer
- [ ] Create `types/paldeck.ts` with TypeScript interfaces
- [ ] Create `data/paldeck.ts` with 30+ initial entries
- [ ] Create `data/paldeck-faq.ts` with FAQ content
- [ ] Add placeholder images (or use emoji icons initially)

### Core Logic
- [ ] `lib/paldeck-filter.ts` - Filter and search logic
  - [ ] `filterPals(pals, filter)` - Apply filters
  - [ ] `searchPals(pals, searchTerm)` - Name search
  - [ ] `sortPals(pals, sortOption)` - Sort logic

### UI Components
- [ ] `components/PaldeckSearch.tsx` - Search input
- [ ] `components/PaldeckFilters.tsx` - Filter panel (collapsible on mobile)
- [ ] `components/PaldeckCard.tsx` - Individual Pal card
- [ ] `components/PaldeckGrid.tsx` - Grid/list view
- [ ] `components/PaldeckDetail.tsx` - Detailed view (modal or separate page)
- [ ] `components/WorkSuitabilityBadge.tsx` - Work level display
- [ ] `components/ElementBadge.tsx` - Element type display

### Pages
- [ ] `app/tools/palworld/paldeck/page.tsx` - Main Paldeck page
- [ ] `app/tools/palworld/paldeck/[id]/page.tsx` - Individual Pal detail page (optional)
- [ ] Add metadata for SEO
- [ ] Add JSON-LD structured data

### Features
- [ ] Real-time search (debounced)
- [ ] Multi-select filters
- [ ] Active filter display with clear buttons
- [ ] Sort dropdown
- [ ] Responsive grid (1 col mobile, 2-3 col tablet, 4+ col desktop)
- [ ] Pagination or infinite scroll
- [ ] Local storage for filter preferences

### SEO & Performance
- [ ] Meta tags (title, description, OG tags)
- [ ] Structured data (FAQ, WebPage, ItemList)
- [ ] Image optimization (lazy loading)
- [ ] Client-side filtering (fast, no backend)
- [ ] Sitemap generation for individual Pal pages

---

## 6. Quick Implementation Tips

### Start Simple
1. **Day 1:** Data schema + 10 example entries
2. **Day 2:** Basic grid view + search
3. **Day 3:** Element and work type filters
4. **Day 4:** Sort options + mobile responsive
5. **Day 5:** FAQ section + JSON-LD + polish

### Progressive Enhancement
- Start with static grid, add filters incrementally
- Use emoji icons initially (🔥 Fire, 💧 Water, 🌿 Grass, ⚡ Electric, ❄️ Ice, 🪨 Ground, 🌑 Dark, 🐉 Dragon)
- Add proper images later
- Client-side only (no API needed)

### Data Collection Strategy
- Scrape competitor sites for validation (don't copy directly)
- Community contributions (Reddit, Discord)
- Game wiki data
- Manual verification from gameplay

### Mobile-First CSS
```css
/* Grid responsive */
.paldeck-grid {
  display: grid;
  grid-template-columns: 1fr;           /* Mobile: 1 column */
  gap: 1rem;
}

@media (min-width: 640px) {
  .paldeck-grid {
    grid-template-columns: repeat(2, 1fr);  /* Tablet: 2 columns */
  }
}

@media (min-width: 1024px) {
  .paldeck-grid {
    grid-template-columns: repeat(4, 1fr);  /* Desktop: 4 columns */
  }
}
```

---

## 7. Success Metrics

**Week 1:**
- 30+ Pal entries live
- 200+ unique visitors
- < 1s page load time

**Month 1:**
- 60+ Pal entries
- 2,000+ unique visitors
- Top 20 Google ranking for "palworld paldeck"

**Month 3:**
- 100+ Pal entries (complete database)
- 10,000+ unique visitors
- Top 5 Google ranking for "palworld paldeck database"

---

This spec is ready for quick implementation. Focus on core functionality first, then iterate based on user feedback.
