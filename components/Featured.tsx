import PropertyCard, { type Property } from "@/components/PropertyCard";

const featuredProperties: Property[] = [
	{
		id: "1",
		title: "Cliff House in Amalfi",
		location: "Amalfi Coast, Italy",
		distance: "1,280 km away",
		dateRange: "12-17 Sep",
		price: "$328 /",
		image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80",
	},
	{
		id: "2",
		title: "Snow Cabin in Niseko",
		location: "Niseko, Japan",
		distance: "4,918 km away",
		dateRange: "21-26 Nov",
		price: "$411 /",
		image: "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1200&q=80",
	},
	{
		id: "3",
		title: "Desert Dome in Wadi Rum",
		location: "Wadi Rum, Jordan",
		distance: "2,907 km away",
		dateRange: "06-10 Oct",
		price: "$219 /",
		image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
	},
	{
		id: "4",
		title: "Canal Loft in Amsterdam",
		location: "Amsterdam, Netherlands",
		distance: "682 km away",
		dateRange: "03-08 Aug",
		price: "$266 /",
		image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80",
	},
	{
		id: "5",
		title: "Rainforest Villa in Ubud",
		location: "Ubud, Indonesia",
		distance: "8,214 km away",
		dateRange: "14-20 Jan",
		price: "$192 /",
		image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
	},
	{
		id: "6",
		title: "Oceanfront House in Lisbon",
		location: "Cascais, Portugal",
		distance: "1,724 km away",
		dateRange: "18-23 Jul",
		price: "$304 /",
		image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
	},
	{
		id: "7",
		title: "Nordic Retreat in Tromso",
		location: "Tromso, Norway",
		distance: "2,431 km away",
		dateRange: "30 Dec-04 Jan",
		price: "$279 /",
		image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
	},
	{
		id: "8",
		title: "Lake House in Queenstown",
		location: "Queenstown, New Zealand",
		distance: "18,092 km away",
		dateRange: "09-14 Feb",
		price: "$359 /",
		image: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1200&q=80",
	},
];

export default function Featured() {
	return (
		<section className="space-y-6">
			<div className="flex items-end justify-between gap-4">
				<h2 className="text-3xl font-bold tracking-[-0.02em] text-[#222222] sm:text-4xl">Featured this week</h2>
				<a href="#" className="text-sm font-semibold text-[#222222] underline underline-offset-4">
					View all stays
				</a>
			</div>

			<div className="grid grid-cols-1 gap-x-6 gap-y-10 min-[550px]:grid-cols-2 min-[800px]:grid-cols-3 min-[1128px]:grid-cols-4 min-[1440px]:grid-cols-5 min-[1760px]:grid-cols-6">
				{featuredProperties.map((property, index) => (
					<PropertyCard key={property.id} property={property} priority={index < 3} />
				))}
			</div>
		</section>
	);
}
