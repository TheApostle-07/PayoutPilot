

"use client";

import Image from "next/image";
import {
  LayoutDashboard,
  Calculator,
  MousePointerClick,
  BadgePercent,
  Receipt,
  Layers,
  LockKeyhole,
  Plug2,
  Bell,
  type LucideIcon,
} from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

const FEATURE_LIST: Feature[] = [
  {
    title: "Real‑Time Mentor Dashboard",
    description:
      "Track earnings, upcoming payouts, and engagement metrics at a glance—updated every few seconds.",
    icon: LayoutDashboard,
  },
  {
    title: "Automated Earnings Calculation",
    description:
      "No spreadsheets. We ingest sessions & course sales, apply rules, and compute payouts instantly.",
    icon: Calculator,
  },
  {
    title: "One‑Click Payouts",
    description:
      "Bulk‑disburse to bank, UPI, or PayPal with a single tap—backed by RazorpayX for lightning speed.",
    icon: MousePointerClick,
  },
  {
    title: "GST & TDS Auto‑Compliance",
    description:
      "We calculate, deduct, and file statutory taxes so you (and your mentors) stay audit‑ready.",
    icon: BadgePercent,
  },
  {
    title: "Beautiful, Branded Invoices",
    description:
      "PDF invoices with your logo, mentor details, and line‑item breakdowns—auto‑emailed after payout.",
    icon: Receipt,
  },
  {
    title: "Multi‑Account Support",
    description:
      "Operate multiple brands or academies under one dashboard while keeping ledgers isolated.",
    icon: Layers,
  },
  {
    title: "Role‑Based Access Control",
    description:
      "Granular permissions for finance, ops, and admin teams—secure by design.",
    icon: LockKeyhole,
  },
  {
    title: "Webhook & API Integrations",
    description:
      "Plug into Shopify, Thinkific, or custom stacks. Real‑time webhooks ensure data consistency.",
    icon: Plug2,
  },
  {
    title: "Slack & Email Notifications",
    description:
      "Mentors get payout alerts; your finance team gets daily summaries. Everybody stays in sync.",
    icon: Bell,
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="relative isolate overflow-hidden bg-gray-50 py-20"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-transparent to-indigo-50" />

      {/* Section Heading */}
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 font-poppins">
          All the power—none of the busywork
        </h2>
        <p className="mt-3 text-lg text-gray-600">
          PayoutPilot handles payouts so you can focus on teaching.
        </p>
      </div>

      {/* GIF Badges */}
     {/* GIF Badges */}
<div className="mt-14 flex flex-wrap justify-center gap-12 px-4">
  {[
    { src: "/wallet.gif", label: "Money in Minutes", large: true },
    { src: "/secure-2.gif", label: "Bank-Level Security", large: false },
    { src: "/love-2.gif",  label: "Loved by Mentors",    large: true },
  ].map(({ src, label, large }) => (
    <figure key={label} className="w-32 flex flex-col items-center gap-3">
      <Image
        src={src}
        alt={label}
        /* 112 × 112 px (h-28 w-28) for the two ‘large’ items, 96 × 96 px for the shield */
        className={`${large ? "h-28 w-28" : "h-24 w-24"} object-contain`}
        width={large ? 152 : 96}
        height={large ? 152 : 96}
        priority
      />
      <figcaption className="text-sm font-medium text-gray-700 text-center">
        {label}
      </figcaption>
    </figure>
  ))}
</div>

      {/* Feature Grid */}
      <div className="mt-16 mx-auto max-w-6xl px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURE_LIST.map((feat) => (
            <div
              key={feat.title}
              className="group rounded-xl bg-white p-6 shadow transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 mb-4">
                <feat.icon className="h-6 w-6 text-blue-600" />
              </span>
              <h3 className="text-xl font-semibold text-gray-900">
                {feat.title}
              </h3>
              <p className="mt-2 text-gray-600">{feat.description}</p>
              <span className="mt-4 block h-[2px] w-10 bg-blue-600 transition-all duration-300 group-hover:w-16" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}