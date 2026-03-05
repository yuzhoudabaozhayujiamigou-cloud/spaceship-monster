# Lethal Company Terminal Commands — MVP Spec (Concise)

**Project:** spaceship.monster  
**Date:** 2026-03-05  
**Status:** Ready for implementation + iteration  

This is a deliberately concise spec so it can be kept in-repo and extended over time.

---

## 1) Page Goals

- Provide a fast, searchable, copy-friendly terminal commands reference.
- Optimize for mobile use during play (quick search + copy).
- Support SEO via clear structure + FAQ schema.

Non-goals (MVP):
- No claim of “100% complete for every mod/version”.
- No authenticated scraping or login-only sources.

---

## 2) Data Schema (TypeScript)

Suggested location:
- `app/tools/lethal-company/terminal-commands/commands.ts` (export the dataset)
- `app/tools/lethal-company/terminal-commands/types.ts` (types)

```ts
export type TerminalCommandCategory =
  | 'Help'
  | 'Ship'
  | 'Radar'
  | 'Scan'
  | 'Doors'
  | 'Communications'
  | 'Info'
  | 'Misc';

export type TerminalCommandSupport =
  | 'Vanilla'
  | 'LikelyVanilla'
  | 'Modded'
  | 'Unknown';

export interface TerminalCommandParam {
  name: string; // e.g. "player", "seed", "value"
  required: boolean;
  description?: string;
}

export interface TerminalCommandEntry {
  id: string; // stable slug, e.g. "help", "scan", "moons"
  command: string; // what the user types, e.g. "HELP"
  aliases?: string[]; // alternative spellings
  category: TerminalCommandCategory;
  params?: TerminalCommandParam[];
  example?: string; // example invocation to copy
  description: string; // 1-2 sentences
  notes?: string; // caveats, version hints
  support: TerminalCommandSupport;
  sourceNote?: string; // e.g. "in-game terminal" / "community" / "unverified"
}

export interface TerminalCommandsFilterState {
  q: string;
  categories: TerminalCommandCategory[]; // multi-select
  support: TerminalCommandSupport[]; // multi-select
}
```

---

## 3) UX + Filters (MVP)

**Primary controls**
- Search by `command`, `aliases`, `description`, `notes`.
- Filter by `category` (multi-select chips).
- Optional filter by `support` (Vanilla/Modded/Unknown).

**List row UI**
- Left: command (monospace) + category badge.
- Right: Copy button for `example ?? command`.
- Expand/collapse to show description + params + notes.

**Bulk actions**
- “Copy filtered list” → join filtered commands into newline-separated text.

---

## 4) Seed Dataset (Starter ~40 commands)

Important: the exact command set can vary by game version/mods. For MVP, keep a useful baseline and mark uncertainty.

```ts
export const TERMINAL_COMMANDS_SEED: TerminalCommandEntry[] = [
  // Help / navigation
  {
    id: 'help',
    command: 'HELP',
    category: 'Help',
    description: 'Shows available terminal commands and basic usage.',
    example: 'HELP',
    support: 'LikelyVanilla',
    sourceNote: 'in-game terminal',
  },
  {
    id: 'clear',
    command: 'CLEAR',
    category: 'Help',
    description: 'Clears the terminal screen.',
    example: 'CLEAR',
    support: 'LikelyVanilla',
    sourceNote: 'in-game terminal',
  },

  // Info / logs
  {
    id: 'moons',
    command: 'MOONS',
    category: 'Info',
    description: 'Lists available moons/locations you can route to.',
    example: 'MOONS',
    support: 'LikelyVanilla',
    sourceNote: 'in-game terminal',
  },
  {
    id: 'store',
    command: 'STORE',
    category: 'Ship',
    description: 'Opens the store menu for buying ship items/upgrades.',
    example: 'STORE',
    support: 'LikelyVanilla',
    sourceNote: 'in-game terminal',
  },
  {
    id: 'storage',
    command: 'STORAGE',
    category: 'Ship',
    description: 'Shows the ship storage / stored items list.',
    example: 'STORAGE',
    support: 'LikelyVanilla',
    sourceNote: 'in-game terminal',
  },
  {
    id: 'bestiary',
    command: 'BESTIARY',
    category: 'Info',
    description: 'Displays creature/enemy log (if available in your version).',
    example: 'BESTIARY',
    support: 'Unknown',
    sourceNote: 'unverified',
    notes: 'If this does not work in your version, remove or mark as Modded.',
  },

  // Routing / travel
  {
    id: 'route',
    command: 'ROUTE',
    aliases: ['ROUTE TO'],
    category: 'Ship',
    params: [{ name: 'moon', required: true, description: 'Moon name from MOONS list.' }],
    description: 'Sets your destination to a moon/location.',
    example: 'ROUTE March',
    support: 'LikelyVanilla',
    sourceNote: 'in-game terminal',
  },
  {
    id: 'confirm',
    command: 'CONFIRM',
    category: 'Ship',
    description: 'Confirms a pending route / store / action.',
    example: 'CONFIRM',
    support: 'LikelyVanilla',
    sourceNote: 'in-game terminal',
  },

  // Scan
  {
    id: 'scan',
    command: 'SCAN',
    category: 'Scan',
    description: 'Scans nearby scrap/objects and displays results.',
    example: 'SCAN',
    support: 'LikelyVanilla',
    sourceNote: 'in-game terminal',
  },

  // Radar
  {
    id: 'view-monitor',
    command: 'VIEW MONITOR',
    category: 'Radar',
    description: 'Shows the main monitor view / ship camera feed.',
    example: 'VIEW MONITOR',
    support: 'Unknown',
    sourceNote: 'unverified',
  },
  {
    id: 'switch',
    command: 'SWITCH',
    category: 'Radar',
    params: [{ name: 'player', required: true, description: 'Player name or number.' }],
    description: 'Switches the radar/monitor to focus on a player.',
    example: 'SWITCH Player1',
    support: 'Unknown',
    sourceNote: 'unverified',
  },

  // Doors / ship controls
  {
    id: 'open',
    command: 'OPEN',
    category: 'Doors',
    description: 'Opens a door (ship/terminal-controlled door if available).',
    example: 'OPEN',
    support: 'Unknown',
    sourceNote: 'unverified',
  },
  {
    id: 'close',
    command: 'CLOSE',
    category: 'Doors',
    description: 'Closes a door (ship/terminal-controlled door if available).',
    example: 'CLOSE',
    support: 'Unknown',
    sourceNote: 'unverified',
  },

  // Communications
  {
    id: 'transmit',
    command: 'TRANSMIT',
    category: 'Communications',
    params: [{ name: 'message', required: true, description: 'Message to transmit.' }],
    description: 'Sends a message via terminal communication channel (if supported).',
    example: 'TRANSMIT meet at ship',
    support: 'Unknown',
    sourceNote: 'unverified',
  },

  // Misc
  {
    id: 'ping',
    command: 'PING',
    category: 'Misc',
    description: 'Test command (if supported).',
    example: 'PING',
    support: 'Unknown',
    sourceNote: 'unverified',
  },

  // --- placeholders to reach ~40 ---
  // Add additional entries iteratively by checking in-game HELP output.
];
```

MVP note: keep the dataset short but useful; it’s fine if many entries are `Unknown` initially. The real win is the UX (search + copy) + SEO structure.

---

## 5) FAQ (for on-page section + FAQPage JSON-LD)

- What are the most useful terminal commands for beginners?
- Why does a command say “unknown/invalid command”?
- How do I quickly copy commands on mobile?
- Are these commands the same across versions and mods?
- How do I use radar-related commands effectively?

---

## 6) JSON-LD

### 6.1 FAQPage

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are the most useful terminal commands for beginners?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Start with HELP, MOONS, ROUTE, CONFIRM, STORE, and SCAN. These cover navigation, routing, buying items, and finding scrap quickly."
      }
    },
    {
      "@type": "Question",
      "name": "Why does a command say unknown or invalid command?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Command availability can vary by game version, host settings, and installed mods. Try HELP to see the commands available in your current run."
      }
    },
    {
      "@type": "Question",
      "name": "Are these commands the same across versions and mods?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Not always. This page aims to be a practical baseline; treat entries marked Unknown/Modded as best-effort until verified in-game."
      }
    }
  ]
}
</script>
```

### 6.2 ItemList (optional)

If you want a second schema block, you can represent commands as a simple `ItemList` (lightweight):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Lethal Company Terminal Commands",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "HELP"},
    {"@type": "ListItem", "position": 2, "name": "MOONS"},
    {"@type": "ListItem", "position": 3, "name": "ROUTE"}
  ]
}
</script>
```

---

## 7) Next Iteration Checklist

- Replace `Unknown` entries by verifying against actual in-game HELP output.
- Add “Copy as one-line” vs “Copy as multi-line” options.
- Add version selector (optional), keyed by dataset variants.
