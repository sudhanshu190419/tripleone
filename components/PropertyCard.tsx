import Image from "next/image";
import { useCallback } from "react";
import { Share2 } from "lucide-react";

export type Property = {
	id: string;
	title: string;
	location: string;
	distance: string;
	dateRange: string;
	price: string;
	image: string;
};

type PropertyCardProps = {
	property: Property;
	priority?: boolean;
};

export default function PropertyCard({ property, priority = false }: PropertyCardProps) {
	const handleShare = useCallback(async (e: React.MouseEvent) => {
		e.stopPropagation();

		const shareUrl = window.location.href;

		try {
			if (navigator.share) {
				await navigator.share({
					title: property.title,
					text: `${property.title} in ${property.location}`,
					url: shareUrl,
				});
				return;
			}

			await navigator.clipboard.writeText(shareUrl);
		} catch {
			try {
				await navigator.clipboard.writeText(shareUrl);
			} catch {
				window.prompt("Copy this stay link", shareUrl);
			}
		}
	}, [property.location, property.title]);

	return (
		<article className="group reveal-up space-y-3" style={{ animationDelay: "120ms" }}>
			<div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
				<Image
					src={property.image}
					alt={property.title}
					fill
					priority={priority}
					sizes="(max-width: 550px) 100vw, (max-width: 1128px) 50vw, (max-width: 1440px) 33vw, 20vw"
					className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
				/>
				<button
					type="button"
					className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/72 text-[#222222] backdrop-blur-sm transition-transform duration-200 hover:scale-105 active:scale-95"
					aria-label={`Save ${property.title}`}
				>
					<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
						<path
							d="M12 20.4C5.5 15.8 3.2 12.8 3.2 9.2A4.6 4.6 0 0 1 7.8 4.6c1.8 0 3.3.8 4.2 2.1a5.2 5.2 0 0 1 4.2-2.1 4.6 4.6 0 0 1 4.6 4.6c0 3.6-2.3 6.6-8.8 11.2Z"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						/>
					</svg>
				</button>
				<button
					type="button"
					onClick={handleShare}
					className="absolute left-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/72 text-[#222222] backdrop-blur-sm transition-transform duration-200 hover:scale-105 active:scale-95"
					aria-label={`Share ${property.title}`}
				>
					<Share2 className="h-4 w-4" aria-hidden="true" />
				</button>
			</div>

			<div className="space-y-1">
				<p className="truncate text-base font-semibold text-[#222222]">{property.location}</p>
				<p className="truncate text-sm font-medium text-[#6a6a6a]">{property.distance}</p>
				<p className="truncate text-sm font-medium text-[#6a6a6a]">{property.dateRange}</p>
				<p className="pt-1 text-sm font-semibold text-[#222222]">
					<span className="text-base">{property.price}</span>
					<span className="font-medium text-[#6a6a6a]"> night</span>
				</p>
			</div>
		</article>
	);
}
