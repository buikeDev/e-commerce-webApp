import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NotFound from "./NotFound";
import { products } from "@/mockData/mockProducts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, ShoppingCart, Minus, Plus, ChevronRight, ArrowLeft, Shield, Truck, RotateCcw, Heart, CheckCircle2 } from "lucide-react";
import { useCart } from "@/contextProvider/CartContext";
import { useWishlist } from "@/contextProvider/WishlistContext";
import { useReviews } from "@/contextProvider/ReviewsContext";
import { useProduct } from "@/hooks/useProducts";

const reviewSchema = z.object({
  name:    z.string().min(2, "Name must be at least 2 characters"),
  title:   z.string().min(3, "Add a short title"),
  comment: z.string().min(10, "Write at least 10 characters"),
});
type ReviewForm = z.infer<typeof reviewSchema>;

const StarPicker = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => {
  const [hovered, setHovered] = React.useState(0);
  return (
    <div className="flex gap-1">
      {Array(5).fill(0).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          onMouseEnter={() => setHovered(i + 1)}
          onMouseLeave={() => setHovered(0)}
        >
          <Star
            size={24}
            className={
              i < (hovered || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        </button>
      ))}
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { getReviews, addReview } = useReviews();
  const [qty, setQty] = React.useState(1);
  const [reviewRating, setReviewRating] = React.useState(0);
  const [ratingError, setRatingError] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [sortOrder, setSortOrder] = React.useState<"recent" | "high" | "low">("recent");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
  });

  const { data: product, isLoading, isError } = useProduct(Number(id));

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-12 w-40 mt-4" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !product) return <NotFound />;

  const inWishlist = isInWishlist(product.id);

  const allReviews = getReviews(product.id);
  const sortedReviews = [...allReviews].sort((a, b) => {
    if (sortOrder === "high") return b.rating - a.rating;
    if (sortOrder === "low")  return a.rating - b.rating;
    return b.date.localeCompare(a.date);
  });
  const avgRating = allReviews.length
    ? allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
    : product.rating;
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: allReviews.filter((r) => r.rating === star).length,
  }));

  const onReviewSubmit = (data: ReviewForm) => {
    if (!reviewRating) { setRatingError("Please select a rating"); return; }
    addReview({ productId: product.id, ...data, rating: reviewRating });
    reset();
    setReviewRating(0);
    setRatingError("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <ChevronRight size={14} />
            <a
              href={`/category/${product.category}`}
              className="hover:text-primary transition-colors capitalize"
            >
              {product.category.replace(/-/g, " ")}
            </a>
            <ChevronRight size={14} />
            <span className="text-foreground line-clamp-1">{product.name}</span>
          </nav>

          {/* Back button */}
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 -ml-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} className="mr-1" />
            Back
          </Button>

          {/* Main product section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">

            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden bg-muted aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <Badge
                  variant={product.badgeColor as any}
                  className="absolute top-4 left-4 text-sm px-3 py-1"
                >
                  {product.badge}
                </Badge>
              )}
              {discount && (
                <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground text-sm font-bold px-3 py-1 rounded-full">
                  -{discount}%
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-sm font-semibold text-primary mb-1">{product.brand}</p>
                <h1 className="text-3xl font-bold text-foreground leading-tight mb-3">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {Array(5).fill(0).map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-foreground">
                  ₦{product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through mb-0.5">
                    ₦{product.originalPrice.toFixed(2)}
                  </span>
                )}
                {discount && (
                  <span className="text-sm font-semibold text-destructive mb-1">
                    Save {discount}%
                  </span>
                )}
              </div>

              {/* Stock */}
              <p className="text-sm font-medium text-green-600">In Stock — Ready to ship</p>

              {/* Quantity */}
              <div>
                <p className="text-sm font-medium mb-2">Quantity</p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="w-10 text-center font-semibold text-lg">{qty}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQty((q) => q + 1)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              {/* Add to cart + wishlist */}
              <div className="flex gap-3">
                <Button size="lg" className="flex-1 sm:flex-none" onClick={handleAddToCart}>
                  <ShoppingCart size={20} className="mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={inWishlist ? "text-red-500 border-red-300 hover:bg-red-50" : ""}
                  onClick={() =>
                    inWishlist
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
                        })
                  }
                >
                  <Heart size={20} className={inWishlist ? "fill-red-500" : ""} />
                </Button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="flex flex-col items-center gap-1 text-center">
                  <Truck size={22} className="text-primary" />
                  <span className="text-xs text-muted-foreground">Free shipping over ₦99</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <Shield size={22} className="text-primary" />
                  <span className="text-xs text-muted-foreground">2-Year warranty</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <RotateCcw size={22} className="text-primary" />
                  <span className="text-xs text-muted-foreground">30-day returns</span>
                </div>
              </div>

              {/* Meta */}
              <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border">
                <p><span className="font-medium text-foreground">SKU:</span> EH-{String(product.id).padStart(5, "0")}</p>
                <p><span className="font-medium text-foreground">Category:</span>{" "}
                  <a
                    href={`/category/${product.category}`}
                    className="hover:text-primary capitalize"
                  >
                    {product.category.replace(/-/g, " ")}
                  </a>
                </p>
                <p><span className="font-medium text-foreground">Brand:</span> {product.brand}</p>
              </div>
            </div>
          </div>

          {/* ── Reviews section ─────────────────────────────────── */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              {/* Rating summary */}
              <div className="flex flex-col gap-4">
                <div className="text-center">
                  <p className="text-6xl font-bold">{avgRating.toFixed(1)}</p>
                  <div className="flex justify-center gap-0.5 my-2">
                    {Array(5).fill(0).map((_, i) => (
                      <Star key={i} size={20} className={i < Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{allReviews.length} review{allReviews.length !== 1 ? "s" : ""}</p>
                </div>

                {/* Rating bars */}
                <div className="space-y-2">
                  {ratingCounts.map(({ star, count }) => {
                    const pct = allReviews.length ? Math.round((count / allReviews.length) * 100) : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 text-sm">
                        <span className="w-4 text-right text-muted-foreground">{star}</span>
                        <Star size={12} className="fill-yellow-400 text-yellow-400 shrink-0" />
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-8 text-muted-foreground">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reviews list + form */}
              <div className="lg:col-span-2 space-y-6">

                {/* Sort + count */}
                {allReviews.length > 0 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{allReviews.length} review{allReviews.length !== 1 ? "s" : ""}</p>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
                      className="text-sm border border-border rounded-md px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="high">Highest Rated</option>
                      <option value="low">Lowest Rated</option>
                    </select>
                  </div>
                )}

                {/* Review list */}
                {sortedReviews.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-4">No reviews yet — be the first!</p>
                ) : (
                  <div className="space-y-5">
                    {sortedReviews.map((review) => (
                      <div key={review.id} className="border-b border-border pb-5 last:border-0">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                            {review.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="font-semibold text-sm">{review.name}</span>
                              {review.verified && (
                                <span className="flex items-center gap-1 text-xs text-green-600">
                                  <CheckCircle2 size={11} /> Verified Purchase
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground ml-auto">{review.date}</span>
                            </div>
                            <div className="flex gap-0.5 mb-1">
                              {Array(5).fill(0).map((_, i) => (
                                <Star key={i} size={13} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                              ))}
                            </div>
                            <p className="font-medium text-sm mb-1">{review.title}</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Write a review form */}
                <div className="bg-card border border-border rounded-xl p-5 mt-4">
                  <h3 className="font-semibold mb-4">Write a Review</h3>

                  {submitted && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 mb-4 text-sm">
                      <CheckCircle2 size={16} /> Your review has been submitted. Thank you!
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onReviewSubmit)} className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <Label>Your Rating</Label>
                      <StarPicker value={reviewRating} onChange={(v) => { setReviewRating(v); setRatingError(""); }} />
                      {ratingError && <p className="text-xs text-destructive">{ratingError}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <Label>Your Name</Label>
                        <Input {...register("name")} placeholder="John D." />
                        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label>Review Title</Label>
                        <Input {...register("title")} placeholder="Summarise your experience" />
                        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label>Your Review</Label>
                      <textarea
                        {...register("comment")}
                        rows={4}
                        placeholder="What did you like or dislike? How was the quality?"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                      {errors.comment && <p className="text-xs text-destructive">{errors.comment.message}</p>}
                    </div>

                    <Button type="submit">Submit Review</Button>
                  </form>
                </div>
              </div>
            </div>
          </section>

          {/* Related products */}
          {related.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((p) => (
                  <Card
                    key={p.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/product/${p.id}`)}
                  >
                    <div className="relative overflow-hidden bg-muted h-48">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {p.badge && (
                        <Badge variant={p.badgeColor as any} className="absolute top-3 right-3">
                          {p.badge}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground font-semibold">{p.brand}</p>
                      <h3 className="font-semibold text-sm line-clamp-2 mt-1 mb-2">{p.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">₦{p.price.toFixed(2)}</span>
                        {p.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            ₦{p.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
