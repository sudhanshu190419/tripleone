import { Clock3, MapPin, ShieldCheck, Zap } from "lucide-react";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Verified stays",
    description:
      "Every listing is reviewed for real property details, so guests know exactly what they are booking.",
  },
  {
    icon: Zap,
    title: "Instant booking",
    description:
      "Reserve approved stays in a few taps with a clean, fast booking flow built for modern travelers.",
  },
  {
    icon: MapPin,
    title: "Premium locations",
    description:
      "Stay close to business hubs and elevated leisure spots in the most desirable parts of the city.",
  },
  {
    icon: Clock3,
    title: "24/7 support",
    description:
      "Our team is available before, during, and after your stay to keep the experience effortless.",
  },
];

export default function WhyChooseTripleOne() {
  return (
    <section className="py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#FCF7F0] px-5 py-10 sm:px-8 sm:py-14 lg:px-16 lg:py-16">

          {/* Header */}
          <div className="mx-auto max-w-5xl text-center">
            <h2
              className="text-[clamp(1.7rem,6vw,3rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-[#151110]"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
              }}
            >
              Why choose{" "}
              <em className="italic underline decoration-[#191414] decoration-1 underline-offset-4">
                TripleOne?
              </em>
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-[14px] sm:text-[16px] lg:text-[18px] leading-[1.8] text-[#6D6258]">
              Built to feel reliable before a guest even taps Book now.
              Our dedication to quality ensures every stay is as exceptional as the next.
            </p>

            {/* Badges */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">

              <span className="inline-flex items-center justify-center rounded-full bg-[#241E1B] px-5 sm:px-7 py-3 text-[12px] sm:text-[13px] font-semibold text-white text-center shadow-[0_10px_18px_rgba(36,30,27,0.18)]">
                4 reasons guests book with confidence
              </span>

              <span className="inline-flex items-center justify-center rounded-full bg-[#E8DDD2] px-5 sm:px-7 py-3 text-[12px] sm:text-[13px] font-medium text-[#3C332D] text-center">
                Guest-first support, every day
              </span>
            </div>
          </div>

          {/* Cards */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {reasons.map((reason, index) => {
              const Icon = reason.icon;

              return (
                <article
                  key={reason.title}
                  className="group rounded-[18px] bg-[#FCF7F0] px-4 py-6 sm:px-5 sm:py-7 transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    animation: `tripleOneCardIn .5s ease ${
                      index * 0.08
                    }s both`,
                  }}
                >
                  {/* Icon */}
                  <div className="mb-4 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#F4D7C7] text-[#7F4A2D] transition-transform duration-200 group-hover:scale-105">
                    <Icon size={18} strokeWidth={2} />
                  </div>

                  {/* Title */}
                  <h3
                    className="text-[20px] sm:text-[23px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#16110E]"
                    style={{
                      fontFamily:
                        "'Cormorant Garamond', Georgia, serif",
                    }}
                  >
                    {reason.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-[14px] sm:text-[15px] leading-[1.7] text-[#6B5F56]">
                    {reason.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes tripleOneCardIn {
          from {
            opacity: 0;
            transform: translateY(16px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </section>
  );
}