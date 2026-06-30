"use client";

import Navbar from "./components/home/Navbar";
import Hero from "./components/home/Hero";
import Features from "./components/home/Features";
import Steps from "./components/home/Steps";
import CTA from "./components/home/CTA";
import Footer from "./components/home/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Steps />
      <CTA />
      <Footer />
    </>
  );
}
