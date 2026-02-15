import Image from "next/image";
import Navbar from "@/components/navbar/Navbar";
import FadeIn from "@/components/ui/FadeIn";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | MINI Store",
  description: "Learn more about our journey and values.",
};

export default function AboutPage() {
  return (
    <main className="bg-linear-to-br from-gray-200 via-gray-300 to-gray-400 min-h-screen pb-20">
      <Navbar />

      {/* hero*/}
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <FadeIn direction="up">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            We are MINI.
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Redefining the modern shopping experience with simplicity, quality,
            and style.
          </p>
        </FadeIn>
      </div>

      {/* story*/}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <FadeIn
            direction="right"
            className="relative aspect-4/3 rounded-2xl overflow-hidden bg-gray-100"
          >
            <Image
              src="/model.jpeg"
              alt="Our Story"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </FadeIn>

          {/* content */}
          <FadeIn direction="left" delay={0.2}>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <div className="space-y-4 text-gray-500 leading-relaxed">
              <p>
                Founded in Pontianak, MINI started with a simple idea: that
                shopping should be effortless and inspiring. We noticed that
                modern consumers were overwhelmed by clutter and noise.
              </p>
              <p>
                Our mission is to curate products that bring joy and utility to
                your life, without the unnecessary complexity. We believe in
                quality over quantity, and sustainability over fast trends.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* stats */}
      <section className="bg-gray-200 py-20 mt-12 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Happy Customers", value: "10k+" },
              { label: "Premium Brands", value: "50+" },
              { label: "Years Experience", value: "5+" },
              { label: "Countries Served", value: "12" },
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1} direction="up">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/*value */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose Us?</h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Quality First",
              desc: "We never compromise on the quality of goods we provide.",
            },
            {
              title: "Sustainable",
              desc: "Committed to eco-friendly packaging and ethical sourcing.",
            },
            {
              title: "24/7 Support",
              desc: "Our team is always here to help you with any questions.",
            },
          ].map((item, i) => (
            <FadeIn
              key={i}
              delay={i * 0.2}
              className="p-8 border border-gray-100 rounded-2xl hover:shadow-lg transition-shadow bg-gray-200"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-500">{item.desc}</p>
            </FadeIn>
          ))}
        </div>
      </section>
    </main>
  );
}
