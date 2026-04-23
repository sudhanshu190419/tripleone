"use client";

import { useState } from "react";

type CategoryId = "homes" | "experiences" | "services";
type MobileNavId = "explore" | "wishlists" | "login";

const categories: Array<{ id: CategoryId; label: string; isNew?: boolean }> = [
	{ id: "homes", label: "Homes" },
	{ id: "experiences", label: "Experiences", isNew: true },
	{ id: "services", label: "Services", isNew: true },
];

const mobileNavItems: Array<{ id: MobileNavId; label: string }> = [
	{ id: "explore", label: "Explore" },
	{ id: "wishlists", label: "Wishlists" },
	{ id: "login", label: "Log in" },
];

function HouseIcon() {
	return (
		<svg viewBox="0 0 48 48" aria-hidden="true" className="h-10 w-10">
			<defs>
				<linearGradient id="roof-gradient" x1="0" x2="1" y1="0" y2="1">
					<stop offset="0%" stopColor="#ff8aa2" />
					<stop offset="100%" stopColor="#ff385c" />
				</linearGradient>
			</defs>
			<path d="M7 23 24 9l17 14v14a2 2 0 0 1-2 2h-8V27H17v12H9a2 2 0 0 1-2-2Z" fill="url(#roof-gradient)" />
			<path d="M4 24 24 7l20 17" fill="none" stroke="#222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
			<rect x="16" y="26" width="16" height="14" rx="3" fill="#fff" stroke="#222" strokeWidth="2" />
			<circle cx="24" cy="33" r="1.6" fill="#222" />
		</svg>
	);
}

function BalloonIcon() {
	return (
		<svg viewBox="0 0 48 48" aria-hidden="true" className="h-10 w-10">
			<defs>
				<linearGradient id="balloon-gradient" x1="0" x2="1" y1="0" y2="1">
					<stop offset="0%" stopColor="#ffd2db" />
					<stop offset="100%" stopColor="#ff385c" />
				</linearGradient>
			</defs>
			<ellipse cx="24" cy="19" rx="11" ry="13" fill="url(#balloon-gradient)" stroke="#222" strokeWidth="2" />
			<path d="M20.5 10.5v16M27.5 10.5v16" stroke="#222" strokeWidth="1.5" />
			<path d="M24 32v4" stroke="#222" strokeWidth="2" strokeLinecap="round" />
			<path d="m20.5 36.5 7 0-1.4 6h-4.2z" fill="#fff" stroke="#222" strokeWidth="2" />
		</svg>
	);
}

function BellIcon() {
	return (
		<svg viewBox="0 0 48 48" aria-hidden="true" className="h-10 w-10">
			<defs>
				<linearGradient id="bell-gradient" x1="0" x2="1" y1="0" y2="1">
					<stop offset="0%" stopColor="#ffd7df" />
					<stop offset="100%" stopColor="#ff385c" />
				</linearGradient>
			</defs>
			<path d="M10 24c0-8 6.2-13.5 14-13.5S38 16 38 24v7H10z" fill="url(#bell-gradient)" stroke="#222" strokeWidth="2" />
			<rect x="8" y="31" width="32" height="7" rx="3.5" fill="#fff" stroke="#222" strokeWidth="2" />
			<circle cx="24" cy="24" r="2" fill="#222" />
		</svg>
	);
}

function CategoryIcon({ id }: { id: CategoryId }) {
	if (id === "experiences") {
		return <BalloonIcon />;
	}

	if (id === "services") {
		return <BellIcon />;
	}

	return <HouseIcon />;
}

export default function Navbar() {
	const [activeCategory, setActiveCategory] = useState<CategoryId>("homes");
	const [activeMobileItem, setActiveMobileItem] = useState<MobileNavId>("explore");

	return (
		<>
			<header className="sticky top-0 z-40 border-b border-[#dddddd] bg-white">
				<div className="mx-auto flex h-20 w-full max-w-[1760px] items-center justify-between gap-5 px-4 sm:px-6 lg:px-10">
					<a href="#" className="hidden items-center gap-2 text-[#ff385c] md:flex" aria-label="Stayfinder home">
						<svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
							<path
								d="M16 4.5c3.8 0 6.9 3.1 6.9 6.9 0 4.1-4 9-6.9 12.2-2.9-3.2-6.9-8.1-6.9-12.2 0-3.8 3.1-6.9 6.9-6.9Zm0 2.8a4.1 4.1 0 0 0-4.1 4.1c0 2.3 1.9 5.5 4.1 8.3 2.3-2.8 4.1-6 4.1-8.3A4.1 4.1 0 0 0 16 7.3Z"
								fill="currentColor"
							/>
						</svg>
						<span className="text-[1.1rem] font-semibold tracking-[-0.01em]">stayfinder</span>
					</a>

					<div className="flex min-w-0 flex-1 items-center justify-center md:hidden">
						<button
							type="button"
							className="flex h-12 w-full max-w-[560px] items-center gap-3 rounded-[32px] border border-[#dddddd] bg-white px-4 text-left shadow-[rgba(0,0,0,0.04)_0_2px_6px_0]"
						>
							<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f2f2f2] text-[#222222]">
								<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
									<circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
									<path d="m16 16 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
								</svg>
							</span>
							<span className="text-sm font-medium text-[#222222]">Start your search</span>
						</button>
					</div>

					<nav className="hidden items-center gap-8 md:flex" aria-label="Browse categories">
						{categories.map((category) => {
							const isActive = activeCategory === category.id;

							return (
								<button
									key={category.id}
									type="button"
									onClick={() => setActiveCategory(category.id)}
									className={`relative flex min-w-[92px] flex-col items-center justify-center gap-1 pb-2 text-center transition-transform duration-150 active:scale-[0.97] ${
										isActive ? "text-[#222222]" : "text-[#6a6a6a]"
									}`}
									aria-pressed={isActive}
								>
									<span className="relative inline-flex h-12 w-12 items-center justify-center">
										<CategoryIcon id={category.id} />
										{category.isNew && (
											<span className="absolute -right-4 -top-1 rounded-full bg-[#172554] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.2px] text-white">
												New
											</span>
										)}
									</span>
									<span className="text-base font-medium">{category.label}</span>
									{isActive && <span className="absolute bottom-0 h-[2px] w-full rounded-full bg-[#222222]" />}
								</button>
							);
						})}
					</nav>

					<div className="hidden items-center gap-3 md:flex">
						<button
							type="button"
							className="h-10 rounded-full px-4 text-sm font-medium text-[#222222] transition-colors hover:bg-[#f7f7f7]"
						>
							Become a host
						</button>
						<button
							type="button"
							className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(0,0,0,0.16)] bg-white text-[#222222]"
							aria-label="Language settings"
						>
							<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
								<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
								<path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" stroke="currentColor" strokeWidth="1.6" />
							</svg>
						</button>
						<button
							type="button"
							className="inline-flex h-11 items-center gap-2 rounded-full border border-[#dddddd] bg-white pl-3 pr-2 text-[#222222] shadow-[rgba(0,0,0,0.04)_0_2px_6px_0]"
							aria-label="User menu"
						>
							<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
								<path d="M4 8h16M4 12h16M4 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
							</svg>
							<span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#6a6a6a] text-white">
								<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
									<circle cx="12" cy="9" r="3.4" fill="currentColor" />
									<path d="M5.5 20a6.5 6.5 0 0 1 13 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
								</svg>
							</span>
						</button>
					</div>
				</div>

				<div className="border-t border-[#dddddd] px-4 pb-3 pt-2 md:hidden">
					<nav className="mx-auto flex max-w-[560px] items-end justify-between gap-3" aria-label="Mobile categories">
						{categories.map((category) => {
							const isActive = activeCategory === category.id;

							return (
								<button
									key={category.id}
									type="button"
									onClick={() => setActiveCategory(category.id)}
									className={`relative flex flex-1 flex-col items-center gap-1 pb-2 text-center ${
										isActive ? "text-[#222222]" : "text-[#6a6a6a]"
									}`}
									aria-pressed={isActive}
								>
									<span className="relative inline-flex h-8 w-8 items-center justify-center">
										<CategoryIcon id={category.id} />
									</span>
									<span className="text-sm font-medium">{category.label}</span>
									{category.isNew && (
										<span className="absolute -right-1 top-0 rounded-full bg-[#172554] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.2px] text-white">
											New
										</span>
									)}
									{isActive && <span className="absolute bottom-0 h-[2px] w-full rounded-full bg-[#222222]" />}
								</button>
							);
						})}
					</nav>
				</div>
			</header>

			<nav
				className="fixed inset-x-0 bottom-0 z-40 border-t border-[#dddddd] bg-white px-6 pb-[max(12px,env(safe-area-inset-bottom))] pt-2 md:hidden"
				aria-label="Bottom navigation"
			>
				<div className="mx-auto flex max-w-[560px] items-center justify-between">
					{mobileNavItems.map((item) => {
						const isActive = activeMobileItem === item.id;

						return (
							<button
								key={item.id}
								type="button"
								onClick={() => setActiveMobileItem(item.id)}
								className={`flex min-w-[72px] flex-col items-center gap-1 px-2 py-1 text-xs font-medium transition-colors ${
									isActive ? "text-[#ff385c]" : "text-[#6a6a6a]"
								}`}
								aria-pressed={isActive}
							>
								<span className="inline-flex h-6 w-6 items-center justify-center">
									{item.id === "explore" && (
										<svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
											<path d="m4 10 8-7 8 7v10a1 1 0 0 1-1 1h-5v-7h-4v7H5a1 1 0 0 1-1-1Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
										</svg>
									)}
									{item.id === "wishlists" && (
										<svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
											<path
												d="M12 20.4C5.5 15.8 3.2 12.8 3.2 9.2A4.6 4.6 0 0 1 7.8 4.6c1.8 0 3.3.8 4.2 2.1a5.2 5.2 0 0 1 4.2-2.1 4.6 4.6 0 0 1 4.6 4.6c0 3.6-2.3 6.6-8.8 11.2Z"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
											/>
										</svg>
									)}
									{item.id === "login" && (
										<svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
											<circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
											<path d="M4 20a8 8 0 0 1 16 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
										</svg>
									)}
								</span>
								<span>{item.label}</span>
							</button>
						);
					})}
				</div>
			</nav>
		</>
	);
}
