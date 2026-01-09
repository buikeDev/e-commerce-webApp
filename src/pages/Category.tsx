import { useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NotFound from "./NotFound";
import { products } from "@/mockData/mockProducts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Category = () => {
  const { category } = useParams<{ category: string }>();

  // Convert URL slug to match category in data
  // "cables-and-wiring" -> "cables & wiring"
  // "switches-and-sockets" -> "switches & sockets"
  // "tools-and-equipment" -> "tools & equipment"
  // "smart-home" -> "smart home"
  const formattedCategory = category;
  // ?.replace(/-and-/g, " & ")
  // .replace(/-/g, " ")
  // .toLowerCase();

  // Filter products by category
  const categoryProducts = products.filter(
    (product) => product.category.toLowerCase() === formattedCategory
  );

  // If no products found, show 404
  if (!formattedCategory || categoryProducts.length === 0) {
    return <NotFound />;
  }

  // Get unique category name for display
  const displayCategoryName = categoryProducts[0]?.category || "";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Category Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold capitalize mb-2">
              {displayCategoryName}
            </h1>
            <p className="text-muted-foreground">
              Showing {categoryProducts.length} product
              {categoryProducts.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative overflow-hidden bg-muted h-48">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {product.badge && (
                    <Badge
                      variant={product.badgeColor as any}
                      className="absolute top-3 right-3"
                    >
                      {product.badge}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <p className="text-xs text-muted-foreground font-semibold">
                      {product.brand}
                    </p>
                    <h3 className="font-semibold text-sm line-clamp-2 mt-1">
                      {product.name}
                    </h3>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex items-center">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={`${
                              i < Math.floor(product.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button className="w-full" size="sm">
                    <ShoppingCart size={16} className="mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Category;
