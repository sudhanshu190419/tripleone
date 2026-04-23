const footerColumns = [
	{
		title: "Support",
		links: ["Help Center", "Cancellation options", "Neighborhood support", "Trust and safety"],
	},
	{
		title: "Hosting",
		links: ["Become a host", "Host resources", "Community forum", "Responsible hosting"],
	},
	{
		title: "Stayfinder",
		links: ["Newsroom", "Careers", "Investors", "Gift cards"],
	},
];

export default function Footer() {
	return (
		<footer className="space-y-8 border-t border-[#dddddd] bg-[#f7f7f7] px-4 py-10 sm:px-6 lg:px-10">
			<div className="mx-auto grid w-full max-w-[1760px] gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{footerColumns.map((column) => (
					<div key={column.title}>
						<h3 className="text-sm font-bold uppercase tracking-[0.08em] text-[#222222]">{column.title}</h3>
						<ul className="mt-3 space-y-2">
							{column.links.map((link) => (
								<li key={link}>
									<a href="#" className="text-sm font-medium text-[#3f3f3f] transition-colors hover:text-[#222222]">
										{link}
									</a>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>

			<div className="mx-auto flex w-full max-w-[1760px] flex-col gap-2 border-t border-[#dddddd] pt-4 text-xs font-medium text-[#6a6a6a] sm:flex-row sm:items-center sm:justify-between">
				<p>2026 Stayfinder, Inc. All rights reserved.</p>
				<div className="flex gap-4">
					<a href="#" className="text-[#428bff] hover:underline">
						Privacy
					</a>
					<a href="#" className="text-[#428bff] hover:underline">
						Terms
					</a>
					<a href="#" className="text-[#428bff] hover:underline">
						Sitemap
					</a>
				</div>
			</div>
		</footer>
	);
}
