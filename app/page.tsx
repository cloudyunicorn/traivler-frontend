"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiOutlineSparkles,
  HiOutlinePaperAirplane,
  HiOutlineBuildingOffice,
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
} from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: HiOutlineSparkles,
    title: "AI-Powered Planning",
    description:
      "Our multi-agent AI analyzes thousands of options to craft your perfect trip.",
    color: "#f97316",
  },
  {
    icon: HiOutlinePaperAirplane,
    title: "Flight Search",
    description:
      "Get real-time flight cost estimates and route suggestions instantly.",
    color: "#2dd4bf",
  },
  {
    icon: HiOutlineBuildingOffice,
    title: "Hotel Recommendations",
    description:
      "Find the best areas and price ranges for your stay, from budget to luxury.",
    color: "#a78bfa",
  },
  {
    icon: HiOutlineMapPin,
    title: "Personalized Itinerary",
    description:
      "Day-by-day plans tailored to your preferences — adventure, culture, food & more.",
    color: "#fbbf24",
  },
  {
    icon: HiOutlineClock,
    title: "Instant Results",
    description:
      "Our agent pipeline runs in parallel to get you results in seconds, not hours.",
    color: "#ff6b6b",
  },
  {
    icon: HiOutlineCurrencyDollar,
    title: "Cost Breakdown",
    description:
      "Transparent cost estimates so you can plan your budget with confidence.",
    color: "#34d399",
  },
];

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-purple/20 blur-[120px]" />
          <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal/10 blur-[150px]" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 text-center pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-white/10 text-sm font-medium text-foreground mb-8 shadow-sm">
              <HiOutlineSparkles className="w-4 h-4 text-accent" />
              <span>Powered by AI Agents</span>
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Plan Your Dream Trip
            <br />
            <span className="gradient-text-accent">in Seconds</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Traivler uses a multi-agent AI pipeline to search flights, find
            hotels, discover places, and build a personalized day-by-day
            itinerary — all tailored to your preferences.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button
              size="lg"
              className="btn-primary border-0 h-auto text-lg py-4 px-8 rounded-full animate-pulse-glow"
              asChild
            >
              <Link href="/plan">Start Planning →</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-auto text-lg py-4 px-8 rounded-full border-card-border hover:border-accent hover:bg-accent-glow text-foreground"
              asChild
            >
              <a href="#features">How It Works</a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Everything You Need,{" "}
              <span className="gradient-text-accent">One Click Away</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Our AI agent pipeline handles the heavy lifting so you can focus
              on the excitement.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={fadeUp}>
                <Card className={cn("glass-card border-0 ring-0 h-full")}>
                  <CardContent className="pt-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: `${feature.color}15` }}
                    >
                      <feature.icon
                        className="w-6 h-6"
                        style={{ color: feature.color }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className={cn("glass-card border-0 ring-0 relative overflow-hidden")}>
              {/* Background glow */}
              <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-primary/10 blur-[80px]" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-purple/10 blur-[80px]" />

              <CardContent className="relative pt-16 pb-16 sm:pt-20 sm:pb-20">
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
                  Ready to <span className="gradient-text-accent">Explore?</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
                  Tell us where you want to go and let our AI agents handle the
                  rest. Your perfect trip is just a few clicks away.
                </p>
                <Button
                  size="lg"
                  className="btn-primary border-0 h-auto text-lg py-4 px-10 rounded-full"
                  asChild
                >
                  <Link href="/plan">Plan My Trip →</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
