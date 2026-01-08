import { Zap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter section */}
      <div className="border-b border-background/10">
        <div className="container py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-bold mb-1">Stay Updated</h3>
              <p className="text-background/70">Get exclusive deals and product updates in your inbox.</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full md:w-80 h-12 bg-background/10 border-background/20 text-background placeholder:text-background/50 focus:border-accent"
              />
              <Button variant="accent" size="lg">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company info */}
          <div>
            <a href="/" className="flex items-center gap-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Zap className="h-6 w-6 text-accent-foreground" />
              </div>
              <span className="font-display text-xl font-bold">ElectroHub</span>
            </a>
            <p className="text-background/70 mb-6 leading-relaxed">
              Your trusted partner for quality electrical supplies. Serving professionals and DIY enthusiasts since 2010.
            </p>
            <div className="flex gap-3">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/10 hover:bg-accent hover:text-accent-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/10 hover:bg-accent hover:text-accent-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/10 hover:bg-accent hover:text-accent-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/10 hover:bg-accent hover:text-accent-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {["About Us", "Contact", "FAQs", "Blog", "Careers", "Press"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-background/70 hover:text-accent transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Categories</h4>
            <ul className="space-y-3">
              {["Cables & Wiring", "Switches & Sockets", "Lighting", "Circuit Breakers", "Tools", "Smart Home"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-background/70 hover:text-accent transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span className="text-background/70">
                  123 Electric Avenue<br />
                  Industrial District, CA 90210
                </span>
              </li>
              <li>
                <a href="tel:+1234567890" className="flex items-center gap-3 text-background/70 hover:text-accent transition-colors">
                  <Phone className="h-5 w-5 text-accent" />
                  +1 (234) 567-890
                </a>
              </li>
              <li>
                <a href="mailto:support@electrohub.com" className="flex items-center gap-3 text-background/70 hover:text-accent transition-colors">
                  <Mail className="h-5 w-5 text-accent" />
                  support@electrohub.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/50">
            <p>© 2025 ElectroHub. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-accent transition-colors">Shipping Info</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
