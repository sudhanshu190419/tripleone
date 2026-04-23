export default function Hero() {
	return (
		<section className="relative overflow-hidden rounded-[28px] border border-[#dddddd] bg-white p-6 sm:p-10 lg:p-14">
			<div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,#ff385c30_0%,#ff385c00_72%)] blur-2xl" />
			<div className="home-orb home-orb-one" />
			<div className="home-orb home-orb-two" />

			<div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
				<div className="space-y-8">
					<p className="reveal-up text-xs font-bold uppercase tracking-[0.24em] text-[#6a6a6a]" style={{ animationDelay: "60ms" }}>
						Crafted Journeys, Not Just Stays
					</p>

					<div className="space-y-4">
						<h1
							className="reveal-up max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-[#222222] sm:text-5xl lg:text-6xl"
							style={{ animationDelay: "120ms" }}
						>
							Find impossible places. Book unforgettable stories.
						</h1>
						<p
							className="reveal-up max-w-2xl text-base font-medium leading-[1.45] text-[#3f3f3f] sm:text-lg"
							style={{ animationDelay: "180ms" }}
						>
							A high-performance booking surface designed for discovery: cinematic destinations, clear pricing, and instant browsing at any scale.
						</p>
					</div>

					<div
						className="reveal-up inline-flex w-full max-w-3xl flex-col gap-3 rounded-[24px] border border-[#dddddd] bg-white p-3 shadow-[rgba(0,0,0,0.04)_0_8px_24px] sm:flex-row sm:items-center"
						style={{ animationDelay: "240ms" }}
					>
						<div className="flex min-w-0 flex-1 items-center justify-between rounded-2xl border border-[#dddddd] px-4 py-3 sm:border-0 sm:border-r">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6a6a6a]">Where</p>
								<p className="truncate text-sm font-semibold text-[#222222]">Anywhere on Earth</p>
							</div>
						</div>
						<div className="flex min-w-0 flex-1 items-center justify-between rounded-2xl border border-[#dddddd] px-4 py-3 sm:border-0 sm:border-r">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6a6a6a]">When</p>
								<p className="truncate text-sm font-semibold text-[#222222]">Add your dates</p>
							</div>
						</div>
						<div className="flex min-w-0 flex-1 items-center justify-between rounded-2xl border border-[#dddddd] px-4 py-3 sm:border-0">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6a6a6a]">Who</p>
								<p className="truncate text-sm font-semibold text-[#222222]">2 guests</p>
							</div>
						</div>
						<button
							type="button"
							className="relative inline-flex h-12 min-w-[148px] items-center justify-center overflow-hidden rounded-xl bg-[#ff385c] px-6 text-base font-semibold text-white transition-transform duration-200 hover:scale-[1.02] active:scale-[0.96]"
						>
							<span className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#ff385c_0%,#e00b41_50%,#92174d_100%)] opacity-90" />
							<span className="relative">Search</span>
						</button>
					</div>

					<div className="reveal-up flex flex-wrap gap-3" style={{ animationDelay: "300ms" }}>
						{["4M+ guests", "99.99% uptime", "150+ countries"].map((chip) => (
							<span key={chip} className="rounded-full border border-[#dddddd] bg-white px-4 py-2 text-sm font-semibold text-[#222222]">
								{chip}
							</span>
						))}
					</div>
				</div>

				<div className="reveal-up relative" style={{ animationDelay: "220ms" }}>
					<div className="home-tilt-card rounded-[24px] border border-[#dddddd] bg-white p-5 shadow-[rgba(0,0,0,0.04)_0_12px_28px]">
						<div className="relative overflow-hidden rounded-[20px] border border-[#dddddd] bg-[#f7f7f7] p-5">
							<div className="mb-4 flex items-center justify-between">
								<p className="text-sm font-semibold text-[#222222]">Live Demand Map</p>
								<span className="rounded-full bg-[#ff385c] px-2 py-1 text-[11px] font-bold text-white">HOT</span>
							</div>
							<div className="grid grid-cols-4 gap-2">
								{Array.from({ length: 16 }).map((_, index) => (
									<span
										key={index}
										className="home-grid-pulse h-8 rounded-lg bg-[linear-gradient(135deg,#ffffff,#f3f3f3)]"
										style={{ animationDelay: `${index * 70}ms` }}
									/>
								))}
							</div>
						</div>
						<div className="mt-4 flex items-center justify-between rounded-2xl border border-[#dddddd] bg-white px-4 py-3">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6a6a6a]">Trending</p>
								<p className="text-sm font-semibold text-[#222222]">Tuscany, Italy</p>
							</div>
							<p className="text-lg font-bold text-[#222222]">$228</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
