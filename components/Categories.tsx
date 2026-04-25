const categoryItems = [
	{
		title: "Homes",
		description: "Iconic stays with private corners and neighborhood soul.",
		icon: "M3 11.5 12 4l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z",
	},
	{
		title: "Experiences",
		description: "Host-led adventures with local experts and small groups.",
		icon: "M12 3c3.9 0 7 3.1 7 7 0 2.7-1.3 5.1-3.2 6.4V19l-1.9 2.7H10L8.1 19v-2.6C6.2 15.1 5 12.7 5 10c0-3.9 3.1-7 7-7Z",
		isNew: true,
	},
	{
		title: "Services",
		description: "Concierge-level essentials delivered directly to your stay.",
		icon: "M4 11c0-2.8 2.2-5 5-5h6c2.8 0 5 2.2 5 5v6H4v-6Zm1 6h14v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-2Z",
		isNew: true,
	},
];

export default function Categories() {
	return (
		<section className="space-y-3">
			<div className="flex items-end justify-between gap-4">
				<h2 className="text-3xl font-bold tracking-[-0.02em] text-[#222222] sm:text-4xl">Pick your travel mode</h2>
				<p className="hidden text-sm font-semibold text-[#6a6a6a] sm:block">One platform. Three ways to roam.</p>
			</div>

			<div className="grid gap-3 md:grid-cols-3">
				{categoryItems.map((item, index) => (
					<article
						key={item.title}
						className="reveal-up group relative overflow-hidden rounded-[20px] border border-[#dddddd] bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[rgba(0,0,0,0.08)_0_12px_24px]"
						style={{ animationDelay: `${90 + index * 80}ms` }}
					>
						<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#ff385c20_0%,#ffffff00_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
						<div className="relative space-y-2.5">
							<div className="flex items-start justify-between">
								<span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#dddddd] bg-[#f7f7f7]">
									<svg viewBox="0 0 24 24" className="h-6 w-6 text-[#222222]" aria-hidden="true">
										<path d={item.icon} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</span>
								{item.isNew && <span className="rounded-full bg-[#172554] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white">New</span>}
							</div>
							<div>
								<h3 className="text-lg font-bold text-[#222222]">{item.title}</h3>
								<p className="mt-1 text-sm font-medium leading-[1.45] text-[#6a6a6a]">{item.description}</p>
							</div>
						</div>
					</article>
				))}
			</div>
		</section>
	);
}
