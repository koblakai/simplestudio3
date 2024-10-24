
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  description: string[];
  durationMonths: number;
  paymentLink?: string;
}

export interface Config {
  studioName: string;
  locations: any[];
  socialMedia: any[];
  enableBlog: boolean;
  enableShop: boolean;
  landingPageImage: string;
  pricing: PricingPlan[];
}

// Ensure pricing plans have all required properties
const pricingWithIds = [
  {
    "description": [
      "Access to all class for one month"
    ],
    "name": "Monthly Unlimited",
    "price": 80
  },
  {
    "price": 120,
    "description": [
      "Access to all classes for one month",
      "Yoga mat rental"
    ],
    "name": "Monthly Premium"
  },
  {
    "name": "Yearly Unlimited",
    "price": 999,
    "description": [
      "Access to all classes for one year "
    ]
  },
  {
    "description": [
      "Access to All Classes",
      "Mat Rental",
      "Access to 2 Specialized Workshops"
    ],
    "name": "Yearly Premium",
    "price": 1199
  },
  {
    "durationMonths": 1,
    "paymentLink": "",
    "description": [
      "Access to one class"
    ],
    "name": "Walk-in ",
    "price": 30
  },
  {
    "price": 50,
    "name": "Walk-in premium",
    "paymentLink": "",
    "durationMonths": 1,
    "description": [
      "Access to one class",
      "Yoga Mat Rental"
    ]
  }
].map((plan: any, index: number) => ({
  id: plan.id || `plan-${index + 1}`,
  name: plan.name,
  price: Number(plan.price),
  description: plan.description || [],
  durationMonths: Number(plan.durationMonths) || 1,
  paymentLink: plan.paymentLink,
}));

export const config: Config = {
  studioName: "Simple Studio",
  locations: [],
  socialMedia: [],
  enableBlog: false,
  enableShop: false,
  landingPageImage: "https://images.unsplash.com/photo-1524863479829-916d8e77f114?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
  pricing: pricingWithIds,
};
