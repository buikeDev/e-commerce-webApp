import { useParams, useNavigate } from "react-router-dom";
import { useWishlist } from "@/contextProvider/WishlistContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NotFound from "./NotFound";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import AddToCartModal from "@/components/modals/AddToCartModal";
import { useCategoryProducts } from "@/hooks/useProducts";

const CardSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="h-48 w-full rounded-none" />
    <CardContent className="p-4 space-y-2">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-8 w-full mt-2" />
    </CardContent>
  </Card>
);

const Category = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [isVisible, setIsVisible] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<{
    id: number; name: string; price: number; image: any;
  } | null>(null);

  const { data: categoryProducts = [], isLoading, isError } = useCategoryProducts(category ?? "");

  const displayCategoryName = categoryProducts[0]?.category || category?.replace(/-/g, " ") || "";

  // After load: if empty, show 404
  if (!isLoading && !isError && !category) return <NotFound />;
  if (!isLoading && !isError && categoryProducts.length === 0) return <NotFound />;

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
              {isLoading
                ? "Loading products…"
                : `Showing ${categoryProducts.length} product${categoryProducts.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Error state */}
          {isError && (
            <div className="py-20 text-center">
              <p className="text-xl font-semibold mb-2">Failed to load products</p>
              <p className="text-muted-foreground">Please try refreshing the page.</p>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading
              ? Array(8).fill(0).map((_, i) => <CardSkeleton key={i} />)
              : categoryProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div
                      className="relative overflow-hidden bg-muted h-48 cursor-pointer"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
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
                      <button
                        className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm border border-border hover:bg-red-50 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          isInWishlist(product.id)
                            ? removeFromWishlist(product.id)
                            : addToWishlist({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                originalPrice: product.originalPrice,
                                image: product.image,
                                brand: product.brand,
                                rating: product.rating,
                                category: product.category,
                              });
                        }}
                      >
                        <Heart
                          size={15}
                          className={isInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}
                        />
                      </button>
                    </div>

                    <CardContent className="p-4">
                      <div className="mb-2">
                        <p className="text-xs text-muted-foreground font-semibold">
                          {product.brand}
                        </p>
                        <h3
                          className="font-semibold text-sm line-clamp-2 mt-1 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          {product.name}
                        </h3>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex items-center">
                          {Array(5).fill(0).map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < Math.floor(product.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }
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
                            ₦{product.price.toFixed(2)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₦{product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <Button
                        onClick={() => {
                          setIsVisible(true);
                          setSelectedProduct({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.image,
                          });
                        }}
                        className="w-full"
                        size="sm"
                      >
                        <ShoppingCart size={16} className="mr-2" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </main>

      <AddToCartModal
        open={isVisible}
        onOpenChange={setIsVisible}
        product={selectedProduct}
      />
      <Footer />
    </div>
  );
};

export default Category;
