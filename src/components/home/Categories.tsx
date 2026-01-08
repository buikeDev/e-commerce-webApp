import { Cable, Lightbulb, Plug, Wrench, Home, Zap } from "lucide-react";

const categories = [
  {
    name: "Cables & Wiring",
    description: "Industrial & residential cables",
    icon: Cable,
    count: 1240,
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "Lighting",
    description: "LED, industrial & decorative",
    icon: Lightbulb,
    count: 856,
    color: "from-amber-500 to-orange-500",
  },
  {
    name: "Switches & Sockets",
    description: "Modern & classic designs",
    icon: Plug,
    count: 634,
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "Circuit Breakers",
    description: "Safety & protection",
    icon: Zap,
    count: 428,
    color: "from-red-500 to-rose-500",
  },
  {
    name: "Tools & Equipment",
    description: "Professional grade tools",
    icon: Wrench,
    count: 592,
    color: "from-slate-600 to-slate-700",
  },
  {
    name: "Smart Home",
    description: "Automation & IoT devices",
    icon: Home,
    count: 315,
    color: "from-purple-500 to-indigo-500",
  },
];

const Categories = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse our extensive collection of electrical supplies organized by category for easy navigation.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <a
              key={category.name}
              href={`/category/${category.name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
              className="group relative flex flex-col items-center p-6 bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-card hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <category.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-foreground text-center mb-1 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-xs text-muted-foreground text-center mb-2 hidden sm:block">
                {category.description}
              </p>
              <span className="text-xs font-medium text-accent">
                {category.count.toLocaleString()} products
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
