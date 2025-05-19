/* -----------------------------------------------------------------------------
 * About Page – Light Theme
 * ---------------------------------------------------------------------------*/

import React from "react";

/**
 * Stack icons use the Devicon icon font already loaded in _document.
 * If you remove Devicon, swap <i> tags for Lucide or SVG icons instead.
 */
const techStack = [
  { icon: "devicon-react-original", name: "React" },
  { icon: "devicon-nodejs-plain", name: "Node.js" },
  { icon: "devicon-express-original", name: "Express" },
  { icon: "devicon-mongodb-plain", name: "MongoDB" },
  { icon: "devicon-html5-plain", name: "HTML5" },
  { icon: "devicon-css3-plain", name: "CSS3" },
  { icon: "devicon-javascript-plain", name: "JavaScript" },
  { icon: "devicon-bootstrap-plain", name: "Bootstrap" },
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 text-gray-800 text-center">
      {/* ────────────────── About copy ────────────────── */}
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight">
        About <span className="text-blue-600">PayoutPilot</span>
      </h1>

      <p className="text-lg leading-relaxed mb-12">
        PayoutPilot streamlines mentor compensation so education platforms can
        focus on learning, not ledgers. From automated earnings calculations to
        one‑click payouts, we deliver bank‑level security and delightful user
        experiences—backed by real‑time dashboards and bullet‑proof compliance.
        <br />
        <br />
        Whether you run a cohort‑based course or a 10,000‑mentor marketplace,
        PayoutPilot removes friction so you can build, teach, and scale
        confidently.
      </p>

      {/* ────────────────── Socials ────────────────── */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Connect with Us</h2>
        <div className="flex justify-center gap-6">
          <a
            href="https://github.com/TheApostle-07"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition"
            aria-label="GitHub"
          >
            <i className="devicon-github-plain text-3xl" />
          </a>
          <a
            href="https://www.linkedin.com/in/rufus-bright-77399a1a3/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition"
            aria-label="LinkedIn"
          >
            <i className="devicon-linkedin-plain text-3xl" />
          </a>
          <a
            href="https://x.com/bright_ruf93341"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition"
            aria-label="Twitter / X"
          >
            <i className="devicon-twitter-original text-3xl" />
          </a>
        </div>
      </section>

      {/* ────────────────── Tech Stack ────────────────── */}
      <section>
        <h2 className="text-2xl font-semibold mb-8">Technologies &amp; Skills</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {techStack.map((tech) => (
            <figure
              key={tech.name}
              className="group flex flex-col items-center gap-4 rounded-lg bg-blue-50 p-8 shadow-sm text-center transition-all duration-200 hover:shadow-md hover:-translate-y-1"
            >
              <i className={`${tech.icon} colored text-6xl transition-all duration-200 group-hover:brightness-110`} />
              <figcaption className="text-lg font-semibold">{tech.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </section>
  );
}