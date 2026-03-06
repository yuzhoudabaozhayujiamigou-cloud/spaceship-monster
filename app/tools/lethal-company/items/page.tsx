import Link from "next/link";

import { buildMetadata } from "../../../_seo/metadata";
import { SITE } from "../../../_seo/site";
import FaqJsonLd from "../../../components/FaqJsonLd";
import ItemsReferenceClient, { type ScrapItem } from "./ItemsReferenceClient";

export const metadata = buildMetadata({
  title: "Lethal Company Items Guide: Complete Scrap Value List",
  description:
    "Complete guide to all Lethal Company items with scrap values, spawn locations, and collection strategies.",
  path: "/tools/lethal-company/items",
});

const SCRAP_ITEMS: ScrapItem[] = [
  {
    id: "airhorn",
    name: "Airhorn",
    valueMin: 52,
    valueMax: 72,
    weightLb: 0,
    rarity: "Common",
    spawn: "Indoor shelves and storage rooms",
    danger: "Low",
    note: "No weight and strong value. Fast pickup for clean exits.",
  },
  {
    id: "apparatus",
    name: "Apparatus",
    valueMin: 80,
    valueMax: 80,
    weightLb: 31,
    rarity: "Rare",
    spawn: "Special apparatus rooms",
    danger: "High",
    note: "Taking it can escalate map danger. Only pull with a coordinated retreat.",
  },
  {
    id: "bee-hive",
    name: "Bee Hive",
    valueMin: 40,
    valueMax: 150,
    weightLb: 0,
    rarity: "Very Rare",
    spawn: "Outdoor nests near facility approaches",
    danger: "High",
    note: "Very high upside but a major outdoor risk if bees are active.",
  },
  {
    id: "big-bolt",
    name: "Big Bolt",
    valueMin: 20,
    valueMax: 32,
    weightLb: 19,
    rarity: "Common",
    spawn: "Experimentation-style industrial interiors",
    danger: "Low",
    note: "Steady filler item when your route is already secured.",
  },
  {
    id: "bottles",
    name: "Bottles",
    valueMin: 44,
    valueMax: 56,
    weightLb: 19,
    rarity: "Uncommon",
    spawn: "Assurance and mixed indoor loot pools",
    danger: "Low",
    note: "Consistent value and easy quota padding in stable runs.",
  },
  {
    id: "brass-bell",
    name: "Brass Bell",
    valueMin: 48,
    valueMax: 80,
    weightLb: 24,
    rarity: "Rare",
    spawn: "Rend-side interiors and paid moon pools",
    danger: "Medium",
    note: "Good payout but heavy enough to tax stamina on long carries.",
  },
  {
    id: "candy",
    name: "Candy",
    valueMin: 6,
    valueMax: 36,
    weightLb: 11,
    rarity: "Common",
    spawn: "Dine and mixed furniture rooms",
    danger: "Low",
    note: "Low baseline value; carry only if pathing is already safe.",
  },
  {
    id: "cash-register",
    name: "Cash Register",
    valueMin: 80,
    valueMax: 160,
    weightLb: 84,
    rarity: "Very Rare",
    spawn: "Artifice and late-game loot tables",
    danger: "High",
    note: "Massive value and massive weight. Assign a dedicated escort route.",
  },
  {
    id: "chemical-jug",
    name: "Chemical Jug",
    valueMin: 32,
    valueMax: 84,
    weightLb: 32,
    rarity: "Uncommon",
    spawn: "Vow-side utility rooms",
    danger: "Medium",
    note: "Worth it when quota pressure is high and exits are clear.",
  },
  {
    id: "clock",
    name: "Clock",
    valueMin: 44,
    valueMax: 56,
    weightLb: 26,
    rarity: "Rare",
    spawn: "Rend and Artifice furniture rooms",
    danger: "Low",
    note: "Reliable medium value but not efficient in long haul conditions.",
  },
  {
    id: "clown-horn",
    name: "Clown Horn",
    valueMin: 52,
    valueMax: 72,
    weightLb: 0,
    rarity: "Uncommon",
    spawn: "March and general toy pools",
    danger: "High",
    note: "Noise can pull outdoor threats. Do not spam near extraction.",
  },
  {
    id: "coffee-mug",
    name: "Coffee Mug",
    valueMin: 24,
    valueMax: 68,
    weightLb: 5,
    rarity: "Common",
    spawn: "Dine office and breakroom spawns",
    danger: "Low",
    note: "Great value-to-weight in many seeds.",
  },
  {
    id: "comedy-mask",
    name: "Comedy Mask",
    valueMin: 28,
    valueMax: 52,
    weightLb: 11,
    rarity: "Uncommon",
    spawn: "Dine and mask-heavy loot tables",
    danger: "Medium",
    note: "Good mid-tier carry when your team can keep pace.",
  },
  {
    id: "control-pad",
    name: "Control Pad",
    valueMin: 30,
    valueMax: 80,
    weightLb: 16,
    rarity: "Uncommon",
    spawn: "Offense and machinery rooms",
    danger: "Low",
    note: "Solid pickup with manageable weight for two-trip routes.",
  },
  {
    id: "cookie-mold-pan",
    name: "Cookie Mold Pan",
    valueMin: 12,
    valueMax: 40,
    weightLb: 16,
    rarity: "Common",
    spawn: "Embrion kitchen-like rooms",
    danger: "Low",
    note: "Usually filler. Skip if stamina is already taxed.",
  },
  {
    id: "diy-flashbang",
    name: "DIY Flashbang",
    valueMin: 10,
    valueMax: 28,
    weightLb: 5,
    rarity: "Uncommon",
    spawn: "Experimentation utility rooms",
    danger: "Medium",
    note: "Lightweight but can create chaos if used without team comms.",
  },
  {
    id: "double-barrel",
    name: "Double-Barrel",
    valueMin: 30,
    valueMax: 90,
    weightLb: 16,
    rarity: "Rare",
    spawn: "Rend hunting and weapon pools",
    danger: "Medium",
    note: "High value but often contested and situational.",
  },
  {
    id: "dust-pan",
    name: "Dust Pan",
    valueMin: 12,
    valueMax: 32,
    weightLb: 0,
    rarity: "Common",
    spawn: "Experimentation and household shelves",
    danger: "Low",
    note: "Free carry slot value. Great for final-minute padding.",
  },
  {
    id: "easter-egg",
    name: "Easter Egg",
    valueMin: 22,
    valueMax: 52,
    weightLb: 3,
    rarity: "Uncommon",
    spawn: "March and event loot pools",
    danger: "Low",
    note: "Strong efficiency item, especially on short paths.",
  },
  {
    id: "egg-beater",
    name: "Egg Beater",
    valueMin: 12,
    valueMax: 44,
    weightLb: 11,
    rarity: "Common",
    spawn: "Vow kitchens and storage rooms",
    danger: "Low",
    note: "Keep only if there is no better medium-value replacement nearby.",
  },
  {
    id: "fancy-lamp",
    name: "Fancy Lamp",
    valueMin: 60,
    valueMax: 128,
    weightLb: 21,
    rarity: "Rare",
    spawn: "Rend and premium interior tables",
    danger: "Medium",
    note: "Excellent value, but protect carriers during extraction.",
  },
  {
    id: "flask",
    name: "Flask",
    valueMin: 16,
    valueMax: 44,
    weightLb: 19,
    rarity: "Common",
    spawn: "Experimentation utility racks",
    danger: "Low",
    note: "Common but weighty. Replace when higher value appears.",
  },
  {
    id: "garbage-lid",
    name: "Garbage Lid",
    valueMin: 12,
    valueMax: 30,
    weightLb: 0,
    rarity: "Common",
    spawn: "Assurance clutter pools",
    danger: "Low",
    note: "No-weight filler; quick pickup only.",
  },
  {
    id: "gift-box",
    name: "Gift Box",
    valueMin: 12,
    valueMax: 28,
    weightLb: 19,
    rarity: "Uncommon",
    spawn: "Experimentation and mixed random drops",
    danger: "High",
    note: "Can turn risky if opened at the wrong time. Treat as controlled loot.",
  },
  {
    id: "gold-bar",
    name: "Gold Bar",
    valueMin: 102,
    valueMax: 210,
    weightLb: 77,
    rarity: "Very Rare",
    spawn: "Artifice, March, Experimentation (low odds)",
    danger: "High",
    note: "Top value item, but weight can ruin stamina and timing.",
  },
  {
    id: "golden-cup",
    name: "Golden Cup",
    valueMin: 40,
    valueMax: 80,
    weightLb: 16,
    rarity: "Rare",
    spawn: "Artifice treasure pools",
    danger: "Low",
    note: "High-quality medium carry for quota spikes.",
  },
  {
    id: "hair-brush",
    name: "Hair Brush",
    valueMin: 8,
    valueMax: 36,
    weightLb: 11,
    rarity: "Common",
    spawn: "Adamance residential rooms",
    danger: "Low",
    note: "Low floor value. Prioritize only on clean runs.",
  },
  {
    id: "hairdryer",
    name: "Hairdryer",
    valueMin: 60,
    valueMax: 100,
    weightLb: 7,
    rarity: "Uncommon",
    spawn: "Artifice and utility shelves",
    danger: "Low",
    note: "One of the best value-to-weight scrap pieces.",
  },
  {
    id: "jar-of-pickles",
    name: "Jar of Pickles",
    valueMin: 32,
    valueMax: 60,
    weightLb: 16,
    rarity: "Uncommon",
    spawn: "Dine kitchen and storage areas",
    danger: "Low",
    note: "Reliable medium-value grab.",
  },
  {
    id: "kitchen-knife",
    name: "Kitchen Knife",
    valueMin: 35,
    valueMax: 35,
    weightLb: 0,
    rarity: "Rare",
    spawn: "Dine weapon-capable loot pools",
    danger: "Medium",
    note: "No weight and stable value. Useful if pathing stays calm.",
  },
  {
    id: "large-axle",
    name: "Large Axle",
    valueMin: 36,
    valueMax: 56,
    weightLb: 16,
    rarity: "Uncommon",
    spawn: "Experimentation machinery interiors",
    danger: "Low",
    note: "Average value; prioritize when no premium loot is nearby.",
  },
  {
    id: "laser-pointer",
    name: "Laser Pointer",
    valueMin: 32,
    valueMax: 100,
    weightLb: 0,
    rarity: "Rare",
    spawn: "Titan and electronics-heavy rooms",
    danger: "Low",
    note: "Great no-weight value variance item.",
  },
  {
    id: "magic-7-ball",
    name: "Magic 7 Ball",
    valueMin: 36,
    valueMax: 72,
    weightLb: 16,
    rarity: "Uncommon",
    spawn: "Dine, Rend, Titan rotation pools",
    danger: "Low",
    note: "Safe medium-value piece in organized runs.",
  },
  {
    id: "magnifying-glass",
    name: "Magnifying Glass",
    valueMin: 44,
    valueMax: 60,
    weightLb: 11,
    rarity: "Uncommon",
    spawn: "Rend furniture and office rooms",
    danger: "Low",
    note: "Stable and efficient carry candidate.",
  },
  {
    id: "old-phone",
    name: "Old Phone",
    valueMin: 48,
    valueMax: 64,
    weightLb: 5,
    rarity: "Uncommon",
    spawn: "Titan electronic room pools",
    danger: "Low",
    note: "Very strong efficiency for quota pacing.",
  },
  {
    id: "painting",
    name: "Painting",
    valueMin: 60,
    valueMax: 124,
    weightLb: 32,
    rarity: "Rare",
    spawn: "Rend high-value interior sets",
    danger: "Medium",
    note: "High value but heavy; pre-plan the carry lane.",
  },
  {
    id: "perfume-bottle",
    name: "Perfume Bottle",
    valueMin: 48,
    valueMax: 104,
    weightLb: 0,
    rarity: "Rare",
    spawn: "Rend and paid moon luxury pools",
    danger: "Low",
    note: "Premium no-weight pickup with excellent upside.",
  },
  {
    id: "pill-bottle",
    name: "Pill Bottle",
    valueMin: 16,
    valueMax: 40,
    weightLb: 0,
    rarity: "Uncommon",
    spawn: "Dine side-room shelves",
    danger: "Low",
    note: "Light quota padding with no stamina penalty.",
  },
  {
    id: "plastic-cup",
    name: "Plastic Cup",
    valueMin: 8,
    valueMax: 24,
    weightLb: 0,
    rarity: "Common",
    spawn: "March and general clutter pools",
    danger: "Low",
    note: "Tiny filler pickup for final sweep exits.",
  },
  {
    id: "plastic-fish",
    name: "Plastic Fish",
    valueMin: 28,
    valueMax: 40,
    weightLb: 0,
    rarity: "Uncommon",
    spawn: "Adamance decorative loot pools",
    danger: "Low",
    note: "No-weight consistency item.",
  },
  {
    id: "player-body",
    name: "Player Body",
    valueMin: 5,
    valueMax: 5,
    weightLb: 11,
    rarity: "Rare",
    spawn: "Any moon after player death",
    danger: "Medium",
    note: "Low value and high risk. Prioritize live loot and survivors first.",
  },
  {
    id: "red-soda",
    name: "Red Soda",
    valueMin: 18,
    valueMax: 90,
    weightLb: 7,
    rarity: "Uncommon",
    spawn: "Dine shelves and snack pools",
    danger: "Low",
    note: "High variance but often worth carrying.",
  },
  {
    id: "remote",
    name: "Remote",
    valueMin: 20,
    valueMax: 48,
    weightLb: 0,
    rarity: "Uncommon",
    spawn: "Embrion control stations",
    danger: "Low",
    note: "Free-carry value booster.",
  },
  {
    id: "toy-robot",
    name: "Toy Robot",
    valueMin: 56,
    valueMax: 88,
    weightLb: 21,
    rarity: "Uncommon",
    spawn: "Embrion toy and storage rooms",
    danger: "Medium",
    note: "High value but loud and weighty during exits.",
  },
  {
    id: "rubber-ducky",
    name: "Rubber Ducky",
    valueMin: 2,
    valueMax: 100,
    weightLb: 0,
    rarity: "Rare",
    spawn: "Adamance and mixed toy pools",
    danger: "Low",
    note: "Extreme variance no-weight item. Keep unless inventory is full.",
  },
  {
    id: "shotgun-shells",
    name: "Shotgun Shells",
    valueMin: 24,
    valueMax: 72,
    weightLb: 0,
    rarity: "Rare",
    spawn: "Rend combat loot sets",
    danger: "Medium",
    note: "No weight but can bait risky detours into combat zones.",
  },
  {
    id: "soccer-ball",
    name: "Soccer Ball",
    valueMin: 32,
    valueMax: 60,
    weightLb: 19,
    rarity: "Uncommon",
    spawn: "Embrion and toy-heavy interiors",
    danger: "Low",
    note: "Decent value, average carry efficiency.",
  },
  {
    id: "steering-wheel",
    name: "Steering Wheel",
    valueMin: 16,
    valueMax: 32,
    weightLb: 16,
    rarity: "Common",
    spawn: "Experimentation machinery rooms",
    danger: "Low",
    note: "Low value relative to weight. Swap out when possible.",
  },
  {
    id: "stop-sign",
    name: "Stop Sign",
    valueMin: 23,
    valueMax: 60,
    weightLb: 24,
    rarity: "Uncommon",
    spawn: "Adamance and road-sign pools",
    danger: "Medium",
    note: "Heavy and two-handed in practice. Carry only with safe routing.",
  },
  {
    id: "tattered-metal-sheet",
    name: "Tattered Metal Sheet",
    valueMin: 10,
    valueMax: 22,
    weightLb: 26,
    rarity: "Common",
    spawn: "Experimentation industrial spawns",
    danger: "Low",
    note: "Poor efficiency item. Usually leave for last.",
  },
  {
    id: "tea-kettle",
    name: "Tea Kettle",
    valueMin: 32,
    valueMax: 56,
    weightLb: 21,
    rarity: "Uncommon",
    spawn: "Vow interiors and kitchen rooms",
    danger: "Low",
    note: "Reasonable mid-tier value for stable teams.",
  },
  {
    id: "teeth",
    name: "Teeth",
    valueMin: 60,
    valueMax: 84,
    weightLb: 0,
    rarity: "Rare",
    spawn: "Dine rare clutter pools",
    danger: "Low",
    note: "High value with zero carry cost.",
  },
  {
    id: "toilet-paper",
    name: "Toilet Paper",
    valueMin: 8,
    valueMax: 24,
    weightLb: 5,
    rarity: "Common",
    spawn: "Embrion utility room clutter",
    danger: "Low",
    note: "Low-value filler for clean final sweeps.",
  },
  {
    id: "toothpaste",
    name: "Toothpaste",
    valueMin: 14,
    valueMax: 48,
    weightLb: 0,
    rarity: "Common",
    spawn: "Dine bathroom and shelf pools",
    danger: "Low",
    note: "No-weight item with acceptable mid-roll upside.",
  },
  {
    id: "toy-cube",
    name: "Toy Cube",
    valueMin: 24,
    valueMax: 44,
    weightLb: 0,
    rarity: "Common",
    spawn: "Assurance toy clutter pools",
    danger: "Low",
    note: "Easy no-weight pickup.",
  },
  {
    id: "toy-train",
    name: "Toy Train",
    valueMin: 40,
    valueMax: 80,
    weightLb: 21,
    rarity: "Rare",
    spawn: "Rend premium toy rooms",
    danger: "Medium",
    note: "Good value if your team can defend the carry path.",
  },
  {
    id: "tragedy-mask",
    name: "Tragedy Mask",
    valueMin: 28,
    valueMax: 52,
    weightLb: 11,
    rarity: "Uncommon",
    spawn: "Titan and mask-heavy pools",
    danger: "Medium",
    note: "Comparable to Comedy Mask, but treat both as medium-value.",
  },
  {
    id: "v-type-engine",
    name: "V-type Engine",
    valueMin: 20,
    valueMax: 56,
    weightLb: 16,
    rarity: "Common",
    spawn: "Experimentation and most moon pools",
    danger: "Low",
    note: "Frequent spawn and decent backup value.",
  },
  {
    id: "wedding-ring",
    name: "Wedding Ring",
    valueMin: 52,
    valueMax: 80,
    weightLb: 16,
    rarity: "Very Rare",
    spawn: "Titan and paid moon elite pools",
    danger: "Low",
    note: "Rare premium item with excellent quota impact.",
  },
  {
    id: "whoopie-cushion",
    name: "Whoopie Cushion",
    valueMin: 6,
    valueMax: 20,
    weightLb: 0,
    rarity: "Uncommon",
    spawn: "Vow and random comedy loot pools",
    danger: "High",
    note: "Noise trap item. Can attract dogs and blow stealth extractions.",
  },
  {
    id: "yield-sign",
    name: "Yield Sign",
    valueMin: 18,
    valueMax: 36,
    weightLb: 42,
    rarity: "Uncommon",
    spawn: "Offense exterior and sign pools",
    danger: "Medium",
    note: "Very heavy for the value. Usually skip unless quota is desperate.",
  },
  {
    id: "zed-dog",
    name: "Zed Dog",
    valueMin: 1,
    valueMax: 199,
    weightLb: 0,
    rarity: "Very Rare",
    spawn: "Ultra-low chance across multiple moons",
    danger: "Low",
    note: "Rarest high-variance item in the pool.",
  },
];

const DANGER_WARNINGS = [
  {
    item: "Apparatus",
    warning:
      "Removing the apparatus can raise pressure inside the facility. Only commit if your extraction route is already set.",
  },
  {
    item: "Bee Hive",
    warning:
      "Hive retrieval is an outdoor commitment. Bring coordinated cover and avoid late-day panic pulls.",
  },
  {
    item: "Whoopie Cushion / Clown Horn",
    warning:
      "Noise items can attract hearing-based threats near the ship. Keep comms and movement quiet during final extraction.",
  },
  {
    item: "Gold Bar / Cash Register",
    warning:
      "Heavy premium items drain stamina quickly. If the path is unsafe, bank lighter high-ratio loot first.",
  },
];

const FAQS = [
  {
    question: "Should we always pick the highest value item first?",
    answer:
      "No. Value-to-risk matters more than raw value. A safe medium item often beats a risky heavy item that causes a wipe.",
  },
  {
    question: "How do I use this list with quota planning?",
    answer:
      "Estimate your realistic average haul from this table, then plug that into the quota calculator with a buffer for bad weather and deaths.",
  },
  {
    question: "Which scraps are usually best for consistency?",
    answer:
      "No-weight and low-weight mid-value items are the most consistent because they preserve stamina and reduce extraction time.",
  },
  {
    question: "Do item values change between versions or mods?",
    answer:
      "Yes. Use this guide as a strong vanilla baseline and re-check in-game when your modpack changes economy behavior.",
  },
];

export default function LethalCompanyItemsPage() {
  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Lethal Company Scrap Value List",
    itemListElement: SCRAP_ITEMS.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: `${SITE.url}/tools/lethal-company/items#${item.id}`,
    })),
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <FaqJsonLd faqs={FAQS} />

      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListStructuredData) }}
        />

        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/tools/lethal-company/"
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            ← Back to Lethal Company Tools
          </Link>
          <span className="text-xs font-mono text-zinc-500">
            {SCRAP_ITEMS.length} scrap items
          </span>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Lethal Company Items Guide: Complete Scrap Value List
          </h1>
          <p className="mt-3 max-w-3xl text-zinc-400 leading-relaxed">
            Complete reference for scrap values, weight, rarity, and typical spawn locations.
            Use this page to optimize haul quality without over-committing into wipe risk.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/tools/lethal-company/quota-calculator/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Quota calculator
            </Link>
            <Link
              href="/tools/lethal-company/terminal-commands/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Terminal commands
            </Link>
            <Link
              href="/tools/lethal-company/moons/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Moons guide
            </Link>
            <Link
              href="/tools/lethal-company/bestiary/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Bestiary
            </Link>
          </div>
        </header>

        <ItemsReferenceClient items={SCRAP_ITEMS} />

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Best Collection Strategy</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <h3 className="text-lg font-semibold">1) Sort by value per stamina</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Prioritize no-weight and low-weight items with stable value. Heavy items are only worth it
                when your route is already controlled.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <h3 className="text-lg font-semibold">2) Run two extraction lanes</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Keep one safe lane for consistent medium loot and one optional lane for premium items
                (Gold Bar, Cash Register, Fancy Lamp).
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <h3 className="text-lg font-semibold">3) Bank before greed pivots</h3>
              <p className="mt-2 text-sm text-zinc-400">
                If the day is unstable, sell part of your haul early. Protecting progress beats chasing one
                extra risky trip.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <h3 className="text-lg font-semibold">4) Pair loot plan with moon + threats</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Your best item target changes with moon variance and monster pressure. Use moon and threat
                context before forcing heavy carries.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-red-900/40 bg-red-950/20 p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-red-100">Dangerous Item Warnings</h2>
          <div className="mt-4 space-y-3">
            {DANGER_WARNINGS.map((entry) => (
              <div
                key={entry.item}
                className="rounded-xl border border-red-900/50 bg-zinc-950/40 p-4"
              >
                <h3 className="text-sm font-semibold text-red-100">{entry.item}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">{entry.warning}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
          <div className="mt-4 space-y-4">
            {FAQS.map((faq) => (
              <div
                key={faq.question}
                className="rounded-xl border border-zinc-800/80 bg-zinc-950/30 p-4"
              >
                <h3 className="text-sm font-semibold text-zinc-100">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/30 p-5">
          <h2 className="text-lg font-semibold">Related Lethal Company Guides</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href="/tools/lethal-company/quota-calculator/"
              className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 hover:border-zinc-700"
            >
              <div className="text-sm font-semibold">Quota Calculator</div>
              <p className="mt-2 text-sm text-zinc-400">
                Turn expected haul values into sell targets with risk buffer.
              </p>
            </Link>
            <Link
              href="/tools/lethal-company/terminal-commands/"
              className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 hover:border-zinc-700"
            >
              <div className="text-sm font-semibold">Terminal Commands</div>
              <p className="mt-2 text-sm text-zinc-400">
                Route faster and avoid terminal mistakes during active cycles.
              </p>
            </Link>
            <Link
              href="/tools/lethal-company/moons/"
              className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 hover:border-zinc-700"
            >
              <div className="text-sm font-semibold">Moons Guide</div>
              <p className="mt-2 text-sm text-zinc-400">
                Choose moons by consistency, weather tolerance, and team skill.
              </p>
            </Link>
            <Link
              href="/tools/lethal-company/bestiary/"
              className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 hover:border-zinc-700"
            >
              <div className="text-sm font-semibold">Bestiary</div>
              <p className="mt-2 text-sm text-zinc-400">
                Adapt item routes to threat behavior and extraction risk.
              </p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
