const trustRows = [
	{
		stat: "4.81",
		label: "Average guest score",
		detail: "Millions of verified reviews and transparent host ratings.",
	},
	{
		stat: "24/7",
		label: "Human support",
		detail: "Real travel specialists available around the clock.",
	},
	{
		stat: "0ms",
		label: "Edge-first pages",
		detail: "Static-first rendering and image optimization for fast load.",
	},
];

export default function WhyUs() {
	return (
		<section className="rounded-[24px] border border-[#dddddd] bg-[#f7f7f7] p-6 sm:p-10">
			<div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
				<div className="space-y-4">
					<p className="text-xs font-bold uppercase tracking-[0.22em] text-[#6a6a6a]">Why Stayfinder</p>
					<h2 className="text-3xl font-bold leading-[1.15] tracking-[-0.02em] text-[#222222] sm:text-4xl">
						Built for delight.
						<br />
						Engineered for scale.
					</h2>
					<p className="max-w-lg text-base font-medium leading-[1.45] text-[#3f3f3f]">
						You get cinematic discovery and confident booking flows. Underneath, the system stays lean, cache-friendly, and globally responsive.
					</p>
				</div>

				<div className="grid gap-4 sm:grid-cols-3">
					{trustRows.map((item, index) => (
						<article
							key={item.label}
							className="reveal-up rounded-2xl border border-[#dddddd] bg-white p-4"
							style={{ animationDelay: `${120 + index * 70}ms` }}
						>
							<p className="text-4xl font-bold tracking-[-0.03em] text-[#222222]">{item.stat}</p>
							<p className="mt-1 text-sm font-semibold text-[#222222]">{item.label}</p>
							<p className="mt-2 text-sm font-medium leading-[1.45] text-[#6a6a6a]">{item.detail}</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
