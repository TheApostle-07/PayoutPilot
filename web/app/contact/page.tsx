/* -----------------------------------------------------------------------------
 * Contact Page – Light Theme
 * -----------------------------------------------------------------------------
 * Team Lead: Rufus Bright
 * Other members: Developers
 * Each card shows photo, role, quote, and social links.
 * ---------------------------------------------------------------------------*/

"use client";

import React from "react";
import Image from "next/image";
import { FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";

interface Member {
  name: string;
  role: "Team Lead" | "Developer";
  email: string;
  linkedin: string;
  github: string;
  portfolio: string;
  image: string;
  quote: string;
}

const team: Member[] = [
  {
    name: "Rufus Bright",
    role: "Team Lead",
    email: "rufusbright595@gmail.com",
    linkedin:
      "https://www.linkedin.com/in/rufus-bright-77399a1a3/",
    github: "https://github.com/TheApostle-07",
    portfolio:
      "https://astonishing-buttercream-aea79d.netlify.app/",
    image: "/rufus.jpeg",
    quote:
      '"I can do all things through Christ who strengthens me." – Philippians 4:13',
  },
  {
    name: "Jasmine Keshari",
    role: "Developer",
    email: "jasminekeshari2@gmail.com",
    linkedin:
      "https://www.linkedin.com/in/jasmine-keshari-950003229",
    github: "https://github.com/jasminekeshari",
    portfolio:
      "https://jasmine-portfolio-githubio.vercel.app/",
    image: "/jasmine.jpeg",
    quote:
      '"Code is like humor. When you have to explain it, it’s bad." – Cory House',
  },
  {
    name: "Atharva Sawant",
    role: "Developer",
    email: "atharva.saawant@gmail.com",
    linkedin:
      "https://www.linkedin.com/in/atharva-sawant-35626a209",
    github: "https://github.com/athu2773",
    portfolio:
      "https://atharvakrishnasawant.netlify.app/",
    image: "/atharva.jpeg",
    quote:
      '"First, solve the problem. Then, write the code." – John Johnson',
  },
];

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 text-gray-800">
      {/* ─────────────────── Heading ─────────────────── */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-4 tracking-tight">
        Contact <span className="text-blue-600">Us</span>
      </h1>
      <p className="text-lg text-center max-w-2xl mx-auto mb-16">
        We value your questions, feedback, and insights. Let us know how we can
        assist you—our inbox is always open!
      </p>

      {/* ─────────────────── Cards ─────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {team.map((m) => {
          const imgClass =
            m.name === 'Atharv Sawant'
              ? 'h-32 w-32 rounded-full border-4 border-blue-200 shadow-md mb-6 object-cover object-top'
              : 'h-32 w-32 rounded-full border-4 border-blue-200 shadow-md mb-6 object-cover';

          return (
            <article
              key={m.email}
              className="group rounded-2xl bg-gradient-to-b from-blue-50 to-white p-8 flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-transform duration-300 hover:-translate-y-1"
            >
              <Image
                src={m.image}
                alt={m.name}
                width={128}
                height={128}
                className={imgClass}
                priority
              />

              <h2 className="text-2xl font-bold mb-1">{m.name}</h2>
              <p className="text-sm text-blue-600 font-medium mb-4">
                {m.role}
              </p>

              <blockquote className="text-sm italic text-gray-600 mb-6">
                {m.quote}
              </blockquote>

              <p className="text-xs text-gray-500 mb-4">{m.email}</p>

              <div className="flex justify-center gap-4 text-lg">
                <a
                  href={m.linkedin}
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  aria-label={`${m.name} on LinkedIn`}
                >
                  <FaLinkedin />
                </a>
                <a
                  href={m.github}
                  target="_blank"
                  className="text-gray-700 hover:text-black transition-colors"
                  aria-label={`${m.name} on GitHub`}
                >
                  <FaGithub />
                </a>
                <a
                  href={m.portfolio}
                  target="_blank"
                  className="text-green-600 hover:text-green-800 transition-colors"
                  aria-label={`${m.name} portfolio`}
                >
                  <FaGlobe />
                </a>
              </div>

              {/* Portfolio CTA */}
              <a
                href={m.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded-full bg-blue-600 px-5 py-2 text-white font-semibold ring-2 ring-blue-600/20 shadow-md group-hover:shadow-lg transition-transform duration-300 hover:-translate-y-0.5 hover:bg-blue-700"
              >
                View&nbsp;Portfolio
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
