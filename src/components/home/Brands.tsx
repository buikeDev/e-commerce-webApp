const brands = [
  { name: "Schneider Electric", logo: "SE" },
  { name: "Siemens", logo: "SI" },
  { name: "ABB", logo: "ABB" },
  { name: "Legrand", logo: "LG" },
  { name: "Eaton", logo: "EA" },
  { name: "Philips", logo: "PH" },
  { name: "Osram", logo: "OS" },
  { name: "Havells", logo: "HV" },
];

const Brands = () => {
  return (
    <section className="py-16 bg-background border-y border-border">
      <div className="container">
        <p className="text-center text-muted-foreground mb-10 text-sm font-medium uppercase tracking-wider">
          Trusted by professionals worldwide • Official distributor
        </p>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-8 items-center">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex items-center justify-center h-16 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted border border-border font-display font-bold text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                {brand.logo}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Brands;
