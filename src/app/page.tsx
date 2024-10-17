"use client";
import "./styles.scss";

import BetSection from "@/components/BetSection";

export default function Home() {
  return (
    <main className='Home'>
      <div className='Heading-Section'>
        <span className='Heading'>Use your Insights & Trade on Opinions with ForeCast</span>
        <span className='Sub-Heading'>
        India’s Primary Prediction Market - built on <img src="/assets/logos/baselogo.svg" alt="Base Logo" class="base-logo"></img>
        </span>
      </div>
      <BetSection />
    </main>
  );
}
