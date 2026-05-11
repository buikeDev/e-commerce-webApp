export interface Review {
  id: string;
  productId: number;
  name: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
}

export const SEED_REVIEWS: Review[] = [
  // Product 1 – Industrial LED Panel Light
  { id: "r1", productId: 1, name: "Emeka O.", rating: 5, title: "Excellent build quality", comment: "Very bright and efficient. Installed in our workshop and the difference was immediately noticeable. Would definitely buy again.", date: "2025-03-12", verified: true },
  { id: "r2", productId: 1, name: "Fatima A.", rating: 4, title: "Great light, slightly warm tone", comment: "Does the job well. The colour temperature is a little warmer than I expected but overall very happy.", date: "2025-02-28", verified: true },
  { id: "r3", productId: 1, name: "Chukwudi N.", rating: 5, title: "Worth every kobo", comment: "Energy savings have been significant. Highly recommended for commercial use.", date: "2025-01-15", verified: false },

  // Product 2 – Smart WiFi Circuit Breaker
  { id: "r4", productId: 2, name: "Tunde B.", rating: 5, title: "Smart home game changer", comment: "Setup was straightforward. Control from my phone works perfectly even when I'm travelling.", date: "2025-04-02", verified: true },
  { id: "r5", productId: 2, name: "Ngozi E.", rating: 3, title: "App could be better", comment: "The hardware is solid but the companion app has some bugs. Hoping for an update soon.", date: "2025-03-20", verified: true },

  // Product 3 – Premium Copper Wire Bundle
  { id: "r6", productId: 3, name: "Ibrahim K.", rating: 5, title: "Pure copper, no complaints", comment: "Good conductivity, well insulated. Used for a full house rewire — zero issues.", date: "2025-04-10", verified: true },
  { id: "r7", productId: 3, name: "Amaka L.", rating: 4, title: "Good quality", comment: "Arrived well packaged. Slightly pricier than market alternatives but the quality difference shows.", date: "2025-03-05", verified: false },

  // Product 4 – Professional Multimeter Kit
  { id: "r8", productId: 4, name: "Seun M.", rating: 5, title: "Professional grade at this price", comment: "Accurate readings, solid casing, good probes. My go-to for all electrical diagnostics.", date: "2025-04-18", verified: true },
  { id: "r9", productId: 4, name: "Yemi A.", rating: 4, title: "Very capable tool", comment: "Has every function I need. The backlit display is a nice touch for working in dark spaces.", date: "2025-02-14", verified: true },
  { id: "r10", productId: 4, name: "Bola F.", rating: 3, title: "Decent but probes wear fast", comment: "The unit itself is great but the probes that come with it started fraying after a few months.", date: "2025-01-30", verified: true },

  // Product 22 – Smart Thermostat
  { id: "r11", productId: 22, name: "Adaeze C.", rating: 5, title: "Best purchase this year", comment: "Cut my electricity bill noticeably. The scheduling feature is incredibly convenient.", date: "2025-04-22", verified: true },
  { id: "r12", productId: 22, name: "Kola T.", rating: 5, title: "Easy install, works great", comment: "Installed in under 20 minutes. The app is intuitive and the device looks premium.", date: "2025-03-30", verified: true },

  // Product 30 – Smart Plug
  { id: "r13", productId: 30, name: "Chisom P.", rating: 4, title: "Solid smart plugs", comment: "Works with my voice assistant. The energy monitoring feature is a bonus I didn't expect.", date: "2025-04-05", verified: true },
  { id: "r14", productId: 30, name: "Rotimi S.", rating: 5, title: "Great value 2-pack", comment: "At this price, getting two is a bargain. Both connected first try.", date: "2025-03-15", verified: true },
];
