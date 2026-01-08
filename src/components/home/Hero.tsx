import { ArrowRight, Truck, Shield, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px] py-16 lg:py-24">
          {/* Content */}
          <div className="text-primary-foreground animate-fade-in">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-semibold mb-6 backdrop-blur-sm">
              ⚡ New Season Collection Available
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Power Your Projects with{" "}
              <span className="text-accent">Premium</span> Electrical Supplies
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg leading-relaxed">
              From cables to circuit breakers, find everything you need for residential, commercial, and industrial electrical work. Quality guaranteed.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Button variant="hero" size="xl">
                Shop Now
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="hero-outline" size="xl">
                View Catalog
              </Button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
                  <Truck className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Free Shipping</p>
                  <p className="text-xs text-primary-foreground/60">Orders $99+</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-sm">2 Year Warranty</p>
                  <p className="text-xs text-primary-foreground/60">On all products</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
                  <Headphones className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-sm">24/7 Support</p>
                  <p className="text-xs text-primary-foreground/60">Expert help</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero image placeholder */}
          <div className="hidden lg:flex justify-center items-center animate-slide-in-right">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/30 rounded-3xl blur-3xl animate-pulse-glow" />
              <div className="relative w-full aspect-square max-w-lg rounded-3xl bg-gradient-to-br from-primary-foreground/20 to-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=600&fit=crop"
                  alt="Electrical supplies and tools"
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
