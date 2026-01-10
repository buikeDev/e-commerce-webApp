import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const products = [
  {
    id: 1,
    name: "Industrial LED Panel Light",
    brand: "LumiPro",
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.8,
    reviews: 234,
    image:
      "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop",
    badge: "Best Seller",
    badgeColor: "default",
  },
  {
    id: 2,
    name: "Smart WiFi Circuit Breaker",
    brand: "PowerGuard",
    price: 156.0,
    originalPrice: null,
    rating: 4.9,
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    badge: "New",
    badgeColor: "secondary",
  },
  {
    id: 3,
    name: "Premium Copper Wire Bundle",
    brand: "CableMaster",
    price: 245.5,
    originalPrice: 289.0,
    rating: 4.7,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=400&h=400&fit=crop",
    badge: "15% Off",
    badgeColor: "destructive",
  },
  {
    id: 4,
    name: "Professional Multimeter Kit",
    brand: "TechTool",
    price: 79.99,
    originalPrice: null,
    rating: 4.6,
    reviews: 312,
    image:
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=400&h=400&fit=crop",
    badge: null,
    badgeColor: null,
  },
  {
    id: 5,
    name: "Smart Dimmer Switch",
    brand: "HomeSmart",
    price: 45.99,
    originalPrice: 59.99,
    rating: 4.5,
    reviews: 203,
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=400&fit=crop",
    badge: "Sale",
    badgeColor: "destructive",
  },
  {
    id: 6,
    name: "Heavy Duty Extension Cord",
    brand: "PowerFlex",
    price: 34.99,
    originalPrice: null,
    rating: 4.8,
    reviews: 445,
    image:
      "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=400&h=400&fit=crop",
    badge: "Top Rated",
    badgeColor: "default",
  },
  {
    id: 7,
    name: "Solar Panel Controller",
    brand: "SunTech",
    price: 189.0,
    originalPrice: 229.0,
    rating: 4.7,
    reviews: 67,
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=400&fit=crop",
    badge: "Eco",
    badgeColor: "secondary",
  },
  {
    id: 8,
    name: "Outdoor Wall Light Fixture",
    brand: "LightScape",
    price: 67.5,
    originalPrice: null,
    rating: 4.4,
    reviews: 128,
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop",
    badge: null,
    badgeColor: null,
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-14 gap-4">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Featured Products
            </h2>
            <p className="text-muted-foreground text-lg">
              Handpicked selection of our most popular electrical supplies
            </p>
          </div>
          <Button variant="outline" size="lg">
            <a href="/AllProducts">View All Products</a>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-card overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.badge && (
                  <Badge
                    variant={product.badgeColor as any}
                    className="absolute top-3 left-3"
                  >
                    {product.badge}
                  </Badge>
                )}
                <button className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm border border-border opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent hover:text-accent-foreground">
                  <Heart className="h-4 w-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-xs font-medium text-primary mb-1">
                  {product.brand}
                </p>
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < Math.floor(product.rating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-foreground">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <Button size="icon" variant="default" className="h-9 w-9">
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
