"use client";

import { useRef } from "react";
import { ArrowRightIcon } from "@/components/havenIcons";
import { destinationCards, marqueeItems, processSteps, stats } from "@/components/homeData";
import { useCounter, useInView } from "@/components/havenHooks";

type Destination = (typeof destinationCards)[number];
type ProcessStep = (typeof processSteps)[number];

function StatCard({ value, suffix, label, index }: { value: number; suffix: string; label: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const count = useCounter(value, inView);

  return (
    <div
      ref={ref}
      className="text-center"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(18px)",
        transition: `all .6s ease ${index * 0.12}s`,
      }}
    >
      <div className="font-display text-[clamp(2rem,4vw,2.8rem)] font-bold leading-none text-[#1C1917]">
        {count}
        {suffix}
      </div>
      <div className="mt-1.5 text-[13px] tracking-[0.03em] text-[#A8A29E]">{label}</div>
    </div>
  );
}

function DestinationCard({ destination, index }: { destination: Destination; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  return (
    <div
      ref={ref}
      className="dc relative aspect-[3/4] cursor-pointer overflow-hidden rounded-[18px] shadow-[0_2px_10px_rgba(0,0,0,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(0,0,0,0.1)]"
      style={{
        background: destination.bg,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(22px)",
        transition: `opacity .5s ease ${index * 0.08}s, transform .5s ease ${index * 0.08}s`,
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(28,25,23,0.55)_0%,transparent_55%)]" />
      <div className="absolute bottom-4 left-4">
        <div className="font-display text-[15px] font-semibold leading-[1.2] text-white">{destination.name}</div>
        <div className="mt-0.5 text-[11px] text-white/65">{destination.sub}</div>
      </div>
    </div>
  );
}

function ProcessStepCard({ step, index }: { step: ProcessStep; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  return (
    <article
      ref={ref}
      className="step rounded-[20px] border border-[#EDE8E2] bg-white p-7 pb-8 shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.07)]"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(22px)",
        transition: `all .6s ease ${index * 0.12}s`,
      }}
    >
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-[46px] w-[46px] items-center justify-center rounded-[13px] bg-[#FEF3EE] text-[21px]">{step.icon}</div>
        <span className="font-display text-[28px] font-bold leading-none text-[#EDE8E2]">{step.number}</span>
      </div>
      <h3 className="mb-2 text-[15px] font-bold tracking-[-0.01em] text-[#1C1917]">{step.title}</h3>
      <p className="text-[13px] leading-[1.75] text-[#A8A29E]">{step.description}</p>
    </article>
  );
}

export default function HavenLowerSections() {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef);

  return (
    <>
      <div className="overflow-hidden border-y border-[#EDE8E2] bg-white py-4">
        <div className="marquee flex whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, index) => (
            <span key={`${item}-${index}`} className="inline-flex items-center gap-3.5 px-6 text-[13px] italic text-[#A8A29E] font-display">
              <span className="inline-block h-1 w-1 rounded-full bg-[#E07B54]" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,56px)] py-20">
        <div ref={titleRef} className="mb-9 flex flex-wrap items-end justify-between gap-4" style={{ opacity: titleInView ? 1 : 0, transform: titleInView ? "translateY(0)" : "translateY(22px)", transition: "all .55s ease" }}>
          <div>
            <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#E07B54]">Inspiration</div>
            <h2 className="font-display text-[clamp(1.7rem,3.5vw,2.7rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[#1C1917]">
              Where do you
              <br />
              <em className="text-[#E07B54]">want to go?</em>
            </h2>
          </div>

          <button className="btn-outline inline-flex items-center gap-2 rounded-[32px] border-[1.5px] border-[#1C1917] bg-white px-6 py-[11px] text-[13px] font-bold text-[#1C1917] transition-all hover:bg-[#1C1917] hover:text-[#FAF8F5]">
            Explore all
            <ArrowRightIcon />
          </button>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,160px),1fr))] gap-3.5">
          {destinationCards.map((destination, index) => (
            <DestinationCard key={destination.name} destination={destination} index={index} />
          ))}
        </div>
      </section>

      <section className="border-y border-[#EDE8E2] bg-white px-[clamp(20px,5vw,56px)] py-16">
        <div className="mx-auto grid max-w-[840px] grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} index={index} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,56px)] py-20">
        <div className="mb-12 text-center">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-[#E07B54]">Simple process</div>
          <h2 className="font-display text-[clamp(1.7rem,3.5vw,2.7rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[#1C1917]">
            Book in <em className="text-[#E07B54]">three steps</em>
          </h2>
        </div>

        <div className="mx-auto grid max-w-[860px] grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
          {processSteps.map((step, index) => (
            <ProcessStepCard key={step.number} step={step} index={index} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,56px)] pb-[88px]">
        <div className="grid items-center gap-10 rounded-[28px] bg-[#1C1917] p-[clamp(40px,6vw,68px)] md:grid-cols-[1fr_auto]">
          <div>
            <div className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#E07B54]">For hosts</div>
            <h2 className="font-display mb-3.5 text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[#FAF8F5]">
              Your space could be
              <br />
              <em className="text-[#E07B54]">someone's favourite stay.</em>
            </h2>
            <p className="max-w-[380px] text-sm font-normal leading-[1.75] text-[#78716C]">
              Join 800,000+ hosts earning with Haven. List your home in under 10 minutes.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <button className="btn-primary inline-flex items-center gap-2 whitespace-nowrap rounded-[32px] bg-[#E07B54] px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#C96840]">
              Start hosting
              <ArrowRightIcon />
            </button>
            <button className="pill rounded-[32px] border border-white/15 bg-transparent px-6 py-3 text-[13px] font-medium text-[#78716C] transition-colors hover:bg-white/10">
              Learn more
            </button>
          </div>
        </div>
      </section>
    </>
  );
}