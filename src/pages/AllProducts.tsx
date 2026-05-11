import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { products as _staticProducts } from "@/mockData/mockProducts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, ShoppingCart, SlidersHorizontal, X, ChevronDown, ChevronUp, Search, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddToCartModal from "@/components/modals/AddToCartModal";
import { useWishlist } from "@/contextProvider/WishlistContext";
import { useProducts } from "@/hooks/useProducts";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "name-az";

const ProductCardSkeleton = () => (
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

const CATEGORIES = [
  { value: "cables-wiring", label: "Cables & Wiring" },
  { value: "switches-sockets", label: "Switches & Sockets" },
  { value: "lighting", label: "Lighting" },
  { value: "circuit-breakers", label: "Circuit Breakers" },
  { value: "tools-equipment", label: "Tools & Equipment" },
  { value: "smart-home", label: "Smart Home" },
];

const ALL_BRANDS = [...new Set(_staticProducts.map((p) => p.brand))].sort();

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "name-az", label: "Name: A–Z" },
];

const AllProducts = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { data: allProducts = [], isLoading, isError } = useProducts();

  // Modal state
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<{
    id: number; name: string; price: number; image: string;
  } | null>(null);

  // Filter state
  const [searchText, setSearchText] = React.useState(() => searchParams.get("q") ?? "");
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = React.useState<string[]>([]);
  const [minPrice, setMinPrice] = React.useState("");
  const [maxPrice, setMaxPrice] = React.useState("");
  const [minRating, setMinRating] = React.useState(0);
  const [sortBy, setSortBy] = React.useState<SortOption>("featured");

  // Sync URL ?q= param into searchText when navigating here from header
  React.useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setSearchText(q);
  }, [searchParams]);

  // Mobile filter panel toggle
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  // Collapsible filter sections
  const [catOpen, setCatOpen] = React.useState(true);
  const [brandOpen, setBrandOpen] = React.useState(true);
  const [priceOpen, setPriceOpen] = React.useState(true);
  const [ratingOpen, setRatingOpen] = React.useState(true);

  const toggleCategory = (val: string) =>
    setSelectedCategories((prev) =>
      prev.includes(val) ? prev.filter((c) => c !== val) : [...prev, val]
    );

  const toggleBrand = (val: string) =>
    setSelectedBrands((prev) =>
      prev.includes(val) ? prev.filter((b) => b !== val) : [...prev, val]
    );

  const clearFilters = () => {
    setSearchText("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
    setMinRating(0);
    setSortBy("featured");
    setSearchParams({});
  };

  const hasActiveFilters =
    searchText.trim() !== "" ||
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    minPrice !== "" ||
    maxPrice !== "" ||
    minRating > 0;

  const filtered = React.useMemo(() => {
    let result = [...allProducts];

    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategories.length > 0)
      result = result.filter((p) => selectedCategories.includes(p.category));

    if (selectedBrands.length > 0)
      result = result.filter((p) => selectedBrands.includes(p.brand));

    if (minPrice !== "") result = result.filter((p) => p.price >= Number(minPrice));
    if (maxPrice !== "") result = result.filter((p) => p.price <= Number(maxPrice));

    if (minRating > 0) result = result.filter((p) => p.rating >= minRating);

    switch (sortBy) {
      case "price-asc":  result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "rating":     result.sort((a, b) => b.rating - a.rating); break;
      case "name-az":    result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }

    return result;
  }, [searchText, selectedCategories, selectedBrands, minPrice, maxPrice, minRating, sortBy]);

  const FilterPanel = () => (
    <aside className="w-full lg:w-64 shrink-0 space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-base">Filters</span>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-destructive hover:underline flex items-center gap-1"
          >
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="border-b border-border pb-4">
        <button
          className="flex items-center justify-between w-full py-2 font-medium text-sm"
          onClick={() => setCatOpen((o) => !o)}
        >
          Category {catOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {catOpen && (
          <div className="mt-2 space-y-2">
            {CATEGORIES.map((cat) => (
              <label key={cat.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.value)}
                  onChange={() => toggleCategory(cat.value)}
                  className="accent-primary w-4 h-4"
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {cat.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price range */}
      <div className="border-b border-border pb-4">
        <button
          className="flex items-center justify-between w-full py-2 font-medium text-sm"
          onClick={() => setPriceOpen((o) => !o)}
        >
          Price Range {priceOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {priceOpen && (
          <div className="mt-2 flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="h-8 text-sm"
              min={0}
            />
            <span className="text-muted-foreground text-sm">–</span>
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="h-8 text-sm"
              min={0}
            />
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="border-b border-border pb-4">
        <button
          className="flex items-center justify-between w-full py-2 font-medium text-sm"
          onClick={() => setRatingOpen((o) => !o)}
        >
          Min Rating {ratingOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {ratingOpen && (
          <div className="mt-2 space-y-1">
            {[4, 3, 2, 1].map((star) => (
              <button
                key={star}
                onClick={() => setMinRating(minRating === star ? 0 : star)}
                className={`flex items-center gap-1.5 w-full px-2 py-1 rounded-md text-sm transition-colors ${
                  minRating === star
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                <div className="flex">
                  {Array(5).fill(0).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={i < star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span>& up</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Brands */}
      <div className="pb-2">
        <button
          className="flex items-center justify-between w-full py-2 font-medium text-sm"
          onClick={() => setBrandOpen((o) => !o)}
        >
          Brand {brandOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {brandOpen && (
          <div className="mt-2 space-y-2 max-h-52 overflow-y-auto pr-1">
            {ALL_BRANDS.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="accent-primary w-4 h-4"
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">

          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-1">All Products</h1>
            <p className="text-muted-foreground">
              Showing {filtered.length} of {allProducts.length} products
            </p>
          </div>

          {/* Inline search */}
          <div className="relative max-w-lg mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search products, brands, categories..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setSearchParams(e.target.value ? { q: e.target.value } : {});
              }}
              className="pl-9 h-10"
            />
            {searchText && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => { setSearchText(""); setSearchParams({}); }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {searchText.trim() && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
                  "{searchText}"
                  <button onClick={() => { setSearchText(""); setSearchParams({}); }}><X size={11} /></button>
                </span>
              )}
              {selectedCategories.map((c) => {
                const label = CATEGORIES.find((cat) => cat.value === c)?.label ?? c;
                return (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {label}
                    <button onClick={() => toggleCategory(c)}><X size={11} /></button>
                  </span>
                );
              })}
              {selectedBrands.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full"
                >
                  {b}
                  <button onClick={() => toggleBrand(b)}><X size={11} /></button>
                </span>
              ))}
              {minPrice !== "" && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
                  Min ₦{minPrice}
                  <button onClick={() => setMinPrice("")}><X size={11} /></button>
                </span>
              )}
              {maxPrice !== "" && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
                  Max ₦{maxPrice}
                  <button onClick={() => setMaxPrice("")}><X size={11} /></button>
                </span>
              )}
              {minRating > 0 && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
                  {minRating}★ & up
                  <button onClick={() => setMinRating(0)}><X size={11} /></button>
                </span>
              )}
            </div>
          )}

          {/* Sort bar + mobile filter toggle */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden flex items-center gap-2"
              onClick={() => setFiltersOpen((o) => !o)}
            >
              <SlidersHorizontal size={15} />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
                  {selectedCategories.length + selectedBrands.length +
                    (minPrice ? 1 : 0) + (maxPrice ? 1 : 0) + (minRating ? 1 : 0)}
                </span>
              )}
            </Button>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-muted-foreground hidden sm:block">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-sm border border-border rounded-md px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile filter panel */}
          {filtersOpen && (
            <div className="lg:hidden border border-border rounded-xl p-4 mb-6 bg-card">
              <FilterPanel />
            </div>
          )}

          <div className="flex gap-8">
            {/* Desktop sidebar */}
            <div className="hidden lg:block">
              <FilterPanel />
            </div>

            {/* Products grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array(9).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-xl font-semibold mb-2">Failed to load products</p>
                  <p className="text-muted-foreground mb-4">Something went wrong. Please try refreshing.</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-xl font-semibold mb-2">No products found</p>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters.</p>
                  <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                          <Badge variant={product.badgeColor as any} className="absolute top-3 right-3">
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
                          <p className="text-xs text-muted-foreground font-semibold">{product.brand}</p>
                          <h3
                            className="font-semibold text-sm line-clamp-2 mt-1 cursor-pointer hover:text-primary transition-colors"
                            onClick={() => navigate(`/product/${product.id}`)}
                          >
                            {product.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1 mb-3">
                          <div className="flex items-center">
                            {Array(5).fill(0).map((_, i) => (
                              <Star
                                key={i}
                                size={13}
                                className={
                                  i < Math.floor(product.rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">({product.reviews})</span>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-lg font-bold">₦{product.price.toFixed(2)}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₦{product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <Button
                          className="w-full"
                          size="sm"
                          onClick={() => {
                            setSelectedProduct({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image: product.image,
                            });
                            setIsModalOpen(true);
                          }}
                        >
                          <ShoppingCart size={16} className="mr-2" />
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <AddToCartModal open={isModalOpen} onOpenChange={setIsModalOpen} product={selectedProduct} />
      <Footer />
    </div>
  );
};

export default AllProducts;
