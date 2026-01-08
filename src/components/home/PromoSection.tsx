import { ArrowRight, Clock, Percent, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const PromoSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Main promo */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 lg:p-12 text-primary-foreground group">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-semibold mb-4">
                <Clock className="h-4 w-4" />
                Limited Time Offer
              </span>
              <h3 className="font-display text-3xl lg:text-4xl font-bold mb-4">
                Save up to 30% on Industrial Lighting
              </h3>
              <p className="text-primary-foreground/80 mb-6 max-w-md">
                Upgrade your facility with energy-efficient LED solutions. Professional-grade lighting at unbeatable prices.
              </p>
              <Button variant="hero" size="lg">
                Shop Lighting Deals
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Secondary promos */}
          <div className="grid gap-6">
            <div className="relative overflow-hidden rounded-2xl bg-accent p-6 lg:p-8 text-accent-foreground group hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-foreground/10 mb-4">
                    <Percent className="h-6 w-6" />
                  </div>
                  <h4 className="font-display text-xl font-bold mb-2">
                    Bulk Order Discounts
                  </h4>
                  <p className="text-accent-foreground/80 text-sm mb-4">
                    Get up to 25% off on orders over $1,000
                  </p>
                  <Button variant="secondary" size="sm">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-card border-2 border-border p-6 lg:p-8 group hover:border-primary hover:shadow-xl transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-display text-xl font-bold text-foreground mb-2">
                    Free Express Shipping
                  </h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    On all orders over $99. Same-day dispatch available.
                  </p>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
