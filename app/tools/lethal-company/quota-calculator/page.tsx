import type { Metadata } from "next";
import QuotaCalculatorClient from "./QuotaCalculatorClient";

export const metadata: Metadata = {
  title: "Lethal Company Quota Calculator – Plan Profit & Deadline | Spaceship.Monster",
  description:
    "Free Lethal Company quota calculator. Calculate required scrap sales, plan purchases, and avoid failing deadlines. Input week, balance, and scrap for instant recommendations.",
  alternates: {
    canonical: "/tools/lethal-company/quota-calculator",
  },
  openGraph: {
    title: "Lethal Company Quota Calculator",
    description:
      "Calculate required scrap sales and plan your profit quota. Free tool with sell recommendations and deadline planning.",
    type: "website",
    url: "/tools/lethal-company/quota-calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lethal Company Quota Calculator",
    description:
      "Calculate required scrap sales and plan your profit quota. Free tool with sell recommendations.",
  },
};

export default function QuotaCalculatorPage() {
  return <QuotaCalculatorClient />;
}
