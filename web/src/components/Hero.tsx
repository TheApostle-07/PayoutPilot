'use client';
import { useCallback } from 'react';
import Image from 'next/image';
export default function Hero() {
  const handleGetStarted = useCallback(() => {
    const target = document.getElementById('features');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  }, []);
  return (
    <section className="relative isolate flex flex-col items-center justify-center text-center min-h-[70vh] overflow-hidden bg-gradient-to-b from-blue-50 via-white to-blue-50 w-full -mx-6 -my-6 md:-mx-8">
      <span
        className="absolute -z-10 h-96 w-96 rounded-full bg-blue-300/30 blur-3xl animate-pulse"
        style={{ top: '-4rem', right: '-6rem' }}
      />
      <div className="relative z-10 px-4">
        <h1 className="mx-auto max-w-4xl text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-gray-900 drop-shadow-md transition-all duration-700">
          Streamline Your Mentor Payouts
        </h1>
        <p className="mt-4 mx-auto max-w-2xl text-lg sm:text-xl text-gray-600">
          Transparent, automated, and real-time payouts for EdTech mentors.
        </p>
        {/* Hero GIF – lightweight loop to draw the eye */}
        <Image
          src="/payment.gif"
          alt="Animated illustration catching attention"
          width={300}
          height={300}
          priority
          className="mx-auto mt-6 h-68 w-68 object-contain select-none"
        />
        <button
          onClick={handleGetStarted}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3 text-white font-semibold shadow-lg ring-1 ring-blue-600/30 hover:bg-blue-700 hover:ring-blue-700/40 focus:outline-none focus:ring-4 focus:ring-blue-400/50 active:scale-95 transition-all duration-300"
        >
          Get Started
        </button>
      </div>
      <span className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-chevron-down text-blue-600"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </section>
  );
}