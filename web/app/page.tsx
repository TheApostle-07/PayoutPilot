/* File: web/app/page.tsx */
'use client';
import { useUser } from '../src/lib/firebaseClient';
import Hero from '../src/components/Hero';

export default function HomePage() {
  const user = useUser();
  return (
    <>
      <Hero />
      {/* Edge: if user is logged in we redirect in Header */}
    </>
  );
}
