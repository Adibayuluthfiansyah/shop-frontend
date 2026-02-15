import Navbar from "@/components/navbar/Navbar";
import FadeIn from "@/components/ui/FadeIn";
import ContactForm from "@/components/contact/ContactForm";
import { Mail, MapPin, Phone } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | MINI Store",
  description: "Get in touch with our team.",
};

export default function ContactPage() {
  return (
    <main className="bg-linear-to-br from-gray-200 via-gray-300 to-gray-400 min-h-screen pb-20">
      <Navbar />

      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeIn className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get in touch
          </h1>
          <p className="text-gray-700 max-w-xl mx-auto">
            Have questions about our products, support services, or anything
            else? Let us know and we&apos;ll get back to you.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* contact info*/}
          <div className="space-y-8">
            <FadeIn direction="right" delay={0.1}>
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Contact Information
              </h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-black">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Our Office</h4>
                    <p className="text-gray-700 text-sm mt-1">
                      Jl. Jenderal Ahmad Yani No. 1<br />
                      Pontianak, Kalimantan Barat
                      <br />
                      Indonesia, 78124
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-black">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Email</h4>
                    <p className="text-gray-700 text-sm mt-1">
                      support@ministore.com
                      <br />
                      adibayuluthfiansyah@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-black">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Phone</h4>
                    <p className="text-gray-700 text-sm mt-1">
                      +62 812 3456 7890 (Main)
                      <br />
                      Mon-Fri, 9am - 5pm
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* maps*/}
            <FadeIn
              direction="right"
              delay={0.2}
              className="w-full h-64 bg-gray-100 rounded-2xl overflow-hidden mt-8"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.8179516312625!2d109.333333!3d-0.022222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwMDEnMjAuMCJTIDEwOcKwMjAnMDAuMCJF!5e0!3m2!1sen!2sid!4v1631234567890!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
            </FadeIn>
          </div>

          {/* contact form*/}
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
