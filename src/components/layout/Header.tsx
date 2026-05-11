import { useEffect, useRef, useState } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Zap,
  Phone,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contextProvider/CartContext";
import { useWishlist } from "@/contextProvider/WishlistContext";
import { useNavigate } from "react-router-dom";
import { products } from "@/mockData/mockProducts";

const categories = [
  "Cables & Wiring",
  "Switches & Sockets",
  "Lighting",
  "Circuit Breakers",
  "Tools & Equipment",
  "Smart Home",
];

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [cartCount, setCartCount] = useState(0);

  const [query, setQuery] = useState("");
  const [mobileQuery, setMobileQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCartCount(cartItems.length);
  }, [cartItems]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const instantResults = query.trim().length >= 2
    ? products
        .filter((p) => {
          const q = query.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
          );
        })
        .slice(0, 5)
    : [];

  const handleSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setDropdownOpen(false);
    navigate(`/AllProducts?q=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, q: string) => {
    if (e.key === "Enter") handleSearch(q);
    if (e.key === "Escape") setDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex h-10 items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <a
              href="tel:+1234567890"
              className="flex items-center gap-1.5 hover:text-accent transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">+1 (234) 567-890</span>
            </a>
            <span className="hidden md:inline text-primary-foreground/70">|</span>
            <span className="hidden md:inline text-primary-foreground/70">
              Free shipping on orders over ₦99
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/track-order" className="hover:text-accent transition-colors">
              Track Order
            </a>
            <span className="text-primary-foreground/70">|</span>
            <a href="/support" className="hover:text-accent transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-card shadow-md">
        <div className="container flex h-20 items-center justify-between gap-6">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-hero">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-xl font-bold text-foreground">
                ElectroHub
              </span>
              <p className="text-xs text-muted-foreground -mt-0.5">
                Electrical Supplies
              </p>
            </div>
          </a>

          {/* Desktop search bar */}
          <div className="hidden md:flex flex-1 max-w-2xl" ref={searchRef}>
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search products, brands, categories..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setDropdownOpen(true);
                }}
                onFocus={() => setDropdownOpen(true)}
                onKeyDown={(e) => handleKeyDown(e, query)}
                className="w-full h-12 pl-11 pr-28 rounded-lg border-2 border-muted focus:border-primary transition-colors"
              />
              <Button
                size="sm"
                className="absolute right-1.5 top-1/2 -translate-y-1/2"
                onClick={() => handleSearch(query)}
              >
                Search
              </Button>

              {/* Instant results dropdown */}
              {dropdownOpen && instantResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                  {instantResults.map((p) => (
                    <button
                      key={p.id}
                      className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-muted transition-colors text-left"
                      onMouseDown={() => {
                        setDropdownOpen(false);
                        setQuery("");
                        navigate(`/product/${p.id}`);
                      }}
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded-md object-cover shrink-0 bg-muted"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.brand} · ₦{p.price.toFixed(2)}</p>
                      </div>
                    </button>
                  ))}
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2.5 border-t border-border hover:bg-muted transition-colors text-sm text-primary font-medium"
                    onMouseDown={() => handleSearch(query)}
                  >
                    <Search size={14} />
                    See all results for "{query}"
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative hidden md:flex">
              <a href="/wishlist">
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                    {wishlistItems.length}
                  </span>
                )}
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <a href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                    {cartCount}
                  </span>
                )}
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Categories nav */}
        <nav className="hidden md:block border-t border-border">
          <div className="container">
            <ul className="flex items-center gap-1">
              <li>
                <a
                  href="/AllProducts"
                  className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-muted transition-colors"
                >
                  All Products
                  <ChevronDown className="h-3.5 w-3.5" />
                </a>
              </li>
              {categories.map((category) => (
                <li key={category}>
                  <a
                    href={`/category/${category
                      .toLowerCase()
                      .replace(/ & /g, "-")
                      .replace(/ /g, "-")}`}
                    className="flex items-center px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                  >
                    {category}
                  </a>
                </li>
              ))}
              <li className="ml-auto">
                <a
                  href="/deals"
                  className="flex items-center px-4 py-3 text-sm font-bold text-accent hover:bg-accent/10 transition-colors"
                >
                  🔥 Hot Deals
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-border animate-fade-in">
          <div className="container py-4">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search products..."
                value={mobileQuery}
                onChange={(e) => setMobileQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsMenuOpen(false);
                    handleSearch(mobileQuery);
                    setMobileQuery("");
                  }
                }}
                className="w-full h-12 pl-11 pr-4"
              />
            </div>
            <ul className="space-y-1">
              <li>
                <a
                  href="/AllProducts"
                  className="block px-4 py-3 font-medium text-foreground hover:bg-muted rounded-lg"
                >
                  All Products
                </a>
              </li>
              {categories.map((category) => (
                <li key={category}>
                  <a
                    href={`/category/${category
                      .toLowerCase()
                      .replace(/ & /g, "-")
                      .replace(/ /g, "-")}`}
                    className="block px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                  >
                    {category}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/deals"
                  className="block px-4 py-3 font-bold text-accent hover:bg-accent/10 rounded-lg"
                >
                  🔥 Hot Deals
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
