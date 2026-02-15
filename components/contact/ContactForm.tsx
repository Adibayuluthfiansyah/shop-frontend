"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import FadeIn from "@/components/ui/FadeIn";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);
    toast.success("Message sent successfully!");
  };

  return (
    <FadeIn
      direction="left"
      className="bg-gray-200 p-8 rounded-2xl border border-gray-100 shadow-sm"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Send us a message
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              First Name
            </label>
            <Input
              required
              placeholder="Adi"
              className="bg-gray-50 border-gray-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Last Name
            </label>
            <Input
              required
              placeholder="Bayu"
              className="bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <Input
            required
            type="email"
            placeholder="adi@example.com"
            className="bg-gray-50 border-gray-200"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Message</label>
          <textarea
            required
            rows={5}
            placeholder="How can we help you?"
            className="flex w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm ring-offset-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-black hover:bg-gray-800 text-white h-11 rounded-lg font-medium"
        >
          {loading ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </FadeIn>
  );
}
