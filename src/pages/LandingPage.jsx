import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import FlowSection from '../components/FlowSection';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function LandingPage() {
  const location = useLocation();

  useEffect(() => {
    const sectionId = location.state?.scrollTo;
    if (!sectionId) {
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.state]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <FlowSection />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
