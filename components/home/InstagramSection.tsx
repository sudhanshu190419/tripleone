import { CardCarousel } from "@/components/ui/card-carousel";

const reels = [
  {
    src: "/instagram/reel1.jpg",
    alt: "Property reel 1",
  },
  {
    src: "/instagram/reel2.jpg",
    alt: "Property reel 2",
  },
  {
    src: "/instagram/reel3.jpg",
    alt: "Property reel 3",
  },
  { 
    src: "/instagram/reel4.jpg",
    alt: "Property reel 4" },
];

export default function InstagramSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        

        <CardCarousel
          images={reels}
          autoplayDelay={2200}
          showPagination={true}
          showNavigation={true}
        />
      </div>
    </section>
  );
}