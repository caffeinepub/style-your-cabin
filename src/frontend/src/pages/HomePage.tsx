import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Download,
  Palette,
  RefreshCw,
  Share2,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import BeforeAfterSlider from "../components/BeforeAfterSlider";
import Footer from "../components/Footer";
import Header from "../components/Header";

const STYLES = [
  {
    id: "modern",
    label: "Modern",
    desc: "Clean lines, neutral palette, minimalist furniture",
    img: "/assets/generated/style-modern.dim_400x300.jpg",
    color: "bg-slate-100",
  },
  {
    id: "minimalist",
    label: "Minimalist",
    desc: "White space, functional pieces, zero clutter",
    img: "/assets/generated/style-minimalist.dim_400x300.jpg",
    color: "bg-stone-50",
  },
  {
    id: "luxury",
    label: "Luxury",
    desc: "Rich textures, gold accents, statement pieces",
    img: "/assets/generated/style-luxury.dim_400x300.jpg",
    color: "bg-amber-50",
  },
  {
    id: "scandinavian",
    label: "Scandinavian",
    desc: "Light wood, cozy textiles, functional beauty",
    img: "/assets/generated/style-scandinavian.dim_400x300.jpg",
    color: "bg-sky-50",
  },
  {
    id: "indianTraditional",
    label: "Indian Traditional",
    desc: "Vibrant colors, ornate patterns, cultural richness",
    img: "/assets/generated/style-indian.dim_400x300.jpg",
    color: "bg-orange-50",
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Visualization",
    desc: "See your redesigned room in under 30 seconds",
  },
  {
    icon: Palette,
    title: "Personalized Decor",
    desc: "Pick items that match your taste and budget",
  },
  {
    icon: Download,
    title: "Save & Share",
    desc: "Download high-res results and share with friends",
  },
  {
    icon: Share2,
    title: "Seamless Integration",
    desc: "Works with any room photo from your phone",
  },
  {
    icon: Sparkles,
    title: "5 Design Styles",
    desc: "From minimalist zen to vibrant Indian Traditional",
  },
  {
    icon: RefreshCw,
    title: "Regenerate Freely",
    desc: "Not happy? Regenerate until it's perfect",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <Badge
                variant="outline"
                className="mb-5 font-sans text-xs tracking-widest uppercase"
              >
                AI-Powered Interior Design
              </Badge>
              <h1 className="font-serif text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Transform Your
                <span className="block italic">Space with AI</span>
              </h1>
              <p className="font-sans text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
                Upload a photo of your room, choose a design style, and let our
                AI redesign your space with beautiful, perfectly-placed decor —
                in seconds.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/design">
                  <Button
                    size="lg"
                    data-ocid="home.primary_button"
                    className="bg-foreground text-primary-foreground hover:bg-foreground/90 font-sans px-8"
                  >
                    Start Designing <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button
                    variant="outline"
                    size="lg"
                    data-ocid="home.secondary_button"
                    className="font-sans"
                  >
                    How it Works
                  </Button>
                </a>
              </div>
            </motion.div>

            {/* Right: Before/After hero mock */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-premium aspect-[4/3]">
                <BeforeAfterSlider
                  beforeSrc="/assets/generated/room-before.dim_800x500.jpg"
                  afterSrc="/assets/generated/room-after-luxury.dim_800x500.jpg"
                  className="w-full h-full"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-card border border-border rounded-xl shadow-card px-4 py-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="font-sans text-sm font-medium">
                  AI Redesigned
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How it Works */}
        <section
          id="how-it-works"
          className="bg-card border-y border-border py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="font-sans text-xs tracking-[0.25em] uppercase text-muted-foreground mb-3">
                Process
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold">
                How It Works
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Upload Your Room",
                  desc: "Drag & drop any photo of your room. We support all major formats.",
                },
                {
                  step: "02",
                  title: "Choose Your Style",
                  desc: "Pick from 5 curated design styles — from Minimalist to Indian Traditional.",
                },
                {
                  step: "03",
                  title: "Get Your Design",
                  desc: "Our AI analyzes your space and places decor items perfectly.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-foreground text-primary-foreground flex items-center justify-center mx-auto mb-4 font-sans font-bold text-sm">
                    {item.step}
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Style Selector */}
        <section
          id="styles"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
          <div className="text-center mb-12">
            <p className="font-sans text-xs tracking-[0.25em] uppercase text-muted-foreground mb-3">
              Aesthetics
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold">
              SELECT YOUR VIBE
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {STYLES.map((style, i) => (
              <motion.div
                key={style.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                data-ocid={`home.item.${i + 1}`}
                className="bg-card rounded-xl overflow-hidden border border-border shadow-card group cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={style.img}
                    alt={style.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-sans font-semibold text-sm mb-1">
                    {style.label}
                  </h3>
                  <p className="font-sans text-xs text-muted-foreground leading-snug mb-3">
                    {style.desc}
                  </p>
                  <Link to="/design">
                    <Button
                      size="sm"
                      variant="outline"
                      data-ocid={"home.secondary_button"}
                      className="w-full text-xs font-sans"
                    >
                      Select
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-card border-y border-border py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="font-sans text-xs tracking-[0.25em] uppercase text-muted-foreground mb-3">
                Tools
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold">
                POWERFUL DESIGN TOOLS
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex gap-4 p-5 bg-background rounded-xl border border-border"
                >
                  <div className="w-10 h-10 rounded-lg bg-foreground/8 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold text-sm mb-1">
                      {feature.title}
                    </h4>
                    <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-6">
              Ready to Redesign?
            </h2>
            <p className="font-sans text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
              Join thousands of homeowners who've transformed their spaces with
              AI.
            </p>
            <Link to="/design">
              <Button
                size="lg"
                data-ocid="home.primary_button"
                className="bg-foreground text-primary-foreground hover:bg-foreground/90 font-sans px-10"
              >
                Start for Free <Sparkles className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
