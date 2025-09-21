export interface Tier {
  name: string;
  price: number;
  features: string[];
  id: string;
}

export const TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    features: [
      "Basic subscription tracking",
      "Manual optimization",
      "Community support"
    ]
  },
  {
    id: "pro",
    name: "Pro",
    price: 4.99,
    features: [
      "All Free features",
      "AI-powered optimization",
      "Priority support",
      "Export data"
    ]
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 15.99,
    features: [
      "All Pro features",
      "Team management",
      "Custom integrations",
      "Dedicated account manager"
    ]
  }
];
