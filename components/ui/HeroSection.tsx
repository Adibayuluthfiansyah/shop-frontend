import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-linear-to-br from-gray-200 via-gray-300 to-gray-400 overflow-hidden">
      <div className="relative container mx-auto px-8 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Customer Avatars */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-3">
                <div className="w-11 h-11 rounded-full bg-black border-2 shadow-md" />
                <div className="w-11 h-11 rounded-full bg-transparent border-2 border-black shadow-md" />
                <div className="w-11 h-11 rounded-full bg-black border-2 shadow-md" />
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-2">
              <h1 className="text-6xl lg:text-7xl font-bold text-black leading-tight tracking-tight">
                GEAR UP EVERY SEASON
              </h1>
              <h2 className="text-6xl lg:text-7xl font-bold text-black leading-tight tracking-tight">
                EVERY WORKO
              </h2>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4">
              <Link href="/shop">
                <Button
                  size="lg"
                  className="bg-black hover:bg-gray-900 text-white rounded-full px-8 h-12 text-sm font-medium tracking-wider uppercase transition-all shadow-lg hover:shadow-xl"
                >
                  SHOP NOW
                </Button>
              </Link>
              <Link href="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white hover:bg-gray-50 text-black border-2 border-gray-300 rounded-full px-8 h-12 text-sm font-medium tracking-wider uppercase transition-all"
                >
                  EXPLORE ALL
                </Button>
              </Link>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-700 max-w-xs leading-relaxed">
              {`Stay cozy without compromising your range of motion. Our women's
              winter range is perfect for those chilly outdoor workouts.`}
            </p>
          </div>

          {/* Right Content - Model Image */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-3/4 rounded-3xl overflow-hidden shadow-2xl">
              <div className="w-full h-full bg-linear-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                <span className="text-gray-600 text-sm">Model Image</span>
              </div>
              If you have the image, use this instead:
              <Image
                src="/model.jpeg"
                alt="Winter collection model"
                fill
                className="object-cover shadow-2xl rounded-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
