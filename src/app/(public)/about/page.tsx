import type { IconType } from "react-icons";
import {
  PiArrowRightLight,
  PiHandHeartLight,
  PiLeafLight,
  PiMapPinLight,
  PiRabbitLight,
  PiSparkleLight,
} from "react-icons/pi";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "About Us",
  description: "Discover the story behind Denise Sparkle and our handcrafted natural beauty products.",
};

type Highlight = { icon: IconType; label: string };
type Value = { icon: IconType; index: string; title: string; text: string };

const highlights: Highlight[] = [
  { icon: PiMapPinLight, label: "Handcrafted in Lebanon" },
  { icon: PiLeafLight, label: "Natural ingredients" },
  { icon: PiHandHeartLight, label: "Blended with intention" },
];

const values: Value[] = [
  {
    icon: PiLeafLight,
    index: "01",
    title: "100% Natural",
    text: "We use plant-based ingredients that are gentle on your skin and the planet.",
  },
  {
    icon: PiRabbitLight,
    index: "02",
    title: "Cruelty Free",
    text: "We never test our products on animals. Beauty should be kind to all living things.",
  },
  {
    icon: PiHandHeartLight,
    index: "03",
    title: "Handmade",
    text: "Every batch is crafted by hand with love, ensuring premium quality in every jar.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-surface-soft min-h-screen pb-24 md:pb-32">
      {/* Hero */}
      <section className="bg-blush-100 px-4 py-24 text-center md:py-32">
        <Container className="max-w-3xl">
          <span
            className="mx-auto mb-8 flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-white/70 text-ink"
            aria-hidden="true"
          >
            <PiSparkleLight className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-ink-muted">
            About Denise Sparkle
          </p>
          <h1 className="mb-6 text-5xl font-display leading-[1.05] text-ink md:text-7xl">
            Our Story
          </h1>
          <div className="mx-auto mb-6 h-px w-12 bg-border" aria-hidden="true" />
          <p className="script-accent text-4xl md:text-5xl">Handcrafted with Love</p>
        </Container>
      </section>

      {/* Highlights strip */}
      <Container className="-mt-8 md:-mt-10">
        <ul className="grid grid-cols-1 divide-y divide-border/50 rounded-3xl border border-border/50 bg-white shadow-card md:grid-cols-3 md:divide-x md:divide-y-0">
          {highlights.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center justify-center gap-3 px-6 py-5 text-sm text-ink-soft"
            >
              <Icon className="h-5 w-5 shrink-0 text-ink" aria-hidden="true" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </Container>

      {/* Story */}
      <Container className="mt-20 md:mt-28">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
          {/* Heading */}
          <div className="md:col-span-5">
            <div className="md:sticky md:top-32">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-ink-muted">
                Our Philosophy
              </p>
              <h2 className="text-3xl font-display leading-tight text-ink md:text-5xl">
                Pure. Natural. Effective.
              </h2>
              <div className="mt-8 h-px w-12 bg-border" aria-hidden="true" />
            </div>
          </div>

          {/* Copy */}
          <div className="space-y-7 text-base leading-[1.85] text-ink-soft md:col-span-7 md:text-lg">
            <p className="text-xl leading-relaxed text-ink md:text-2xl">
              Denise Sparkle was born from a simple belief: that true beauty comes from nature.
            </p>
            <p>
              We believe that caring for your skin and hair shouldn&apos;t require harsh chemicals or
              complicated routines. It should be a moment of joy, a spark of confidence in your
              everyday life.
            </p>
            <p>
              Every product in our collection is carefully handcrafted in Lebanon. From our soothing
              Hair Mists to our deeply nourishing Body Butters, we source only the highest quality
              natural ingredients. We take the time to blend each batch with intention, ensuring that
              every bottle, jar, and bar delivers exactly what your skin needs.
            </p>
            <p>
              Whether you are looking to restore your natural glow, pamper yourself after a long day,
              or find the perfect gift for a loved one, Denise Sparkle is here to remind you that you
              are beautiful, powerful, and naturally sparkling.
            </p>
          </div>
        </div>
      </Container>

      {/* Values */}
      <Container className="mt-24 md:mt-36">
        <div className="mb-12 text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-ink-muted">
            What We Stand For
          </p>
          <h2 className="text-3xl font-display text-ink md:text-4xl">Our Promise</h2>
        </div>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {values.map(({ icon: Icon, index, title, text }) => (
            <li
              key={title}
              className="group relative rounded-3xl border border-border/50 bg-white p-8 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card md:p-10"
            >
              <span className="absolute right-6 top-6 text-xs font-medium tracking-[0.25em] text-ink-muted/70 transition-colors duration-300 group-hover:text-ink">
                {index}
              </span>
              <span
                className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blush-100 text-ink transition-colors duration-300 group-hover:bg-blush-200"
                aria-hidden="true"
              >
                <Icon className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
              </span>
              <h3 className="mb-3 text-xl font-display text-ink">{title}</h3>
              <p className="text-sm leading-relaxed text-ink-muted">{text}</p>
            </li>
          ))}
        </ul>
      </Container>

      {/* CTA */}
      <Container className="mt-24 md:mt-36">
        <div className="rounded-3xl bg-blush-100 px-6 py-16 text-center md:py-20">
          <span
            className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-white/70 text-ink"
            aria-hidden="true"
          >
            <PiSparkleLight className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="mb-3 text-3xl font-display text-ink md:text-4xl">Ready to Sparkle?</h2>
          <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-ink-soft">
            Explore our handcrafted collection and find the ritual that feels like yours.
          </p>
          <Button href="/shop" size="lg">
            <span className="inline-flex items-center gap-2">
              EXPLORE THE COLLECTION
              <PiArrowRightLight className="h-4 w-4" aria-hidden="true" />
            </span>
          </Button>
        </div>
      </Container>
    </main>
  );
}