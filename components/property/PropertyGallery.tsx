import Image from "next/image";

export default function PropertyGallery({ images }: { images: string[] }) {
  // Ensure we have at least 3 images for the layout
  const displayImages = [...images];
  while (displayImages.length < 3) displayImages.push(displayImages[0]);

  return (
    <div className="relative mb-12 group">
      {/* Sleek asymmetric grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
        
        {/* Main Feature Image */}
        <div className="md:col-span-2 relative h-full overflow-hidden">
          <Image
            src={displayImages[0]}
            alt="Property primary view"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Subtle overlay for premium feel */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent pointer-events-none" />
        </div>

        {/* Side Stack */}
        <div className="hidden md:flex flex-col gap-2 h-full">
          <div className="relative h-1/2 w-full overflow-hidden">
            <Image
              src={displayImages[1]}
              alt="Property detail 1"
              fill
              sizes="33vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="relative h-1/2 w-full overflow-hidden">
            <Image
              src={displayImages[2]}
              alt="Property detail 2"
              fill
              sizes="33vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </div>

      {/* Modern Floating Button */}
      <button className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md hover:bg-white text-zinc-900 px-5 py-2.5 rounded-full text-sm font-medium shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        View Gallery
      </button>
    </div>
  );
}