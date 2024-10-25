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

const pricingWithIds = [
  {
    "name": "Monthly Unlimited",
    "price": 80,
    "description": [
      "Access to all class for one month"
    ]
  },
  {
    "price": 120,
    "name": "Monthly Premium",
    "description": [
      "Access to all classes for one month",
      "Yoga mat rental"
    ]
  },
  {
    "name": "Yearly Unlimited",
    "price": 999,
    "description": [
      "Access to all classes for one year "
    ]
  },
  {
    "name": "Yearly Premium",
    "description": [
      "Access to All Classes",
      "Mat Rental",
      "Access to 2 Specialized Workshops"
    ],
    "price": 1199
  },
  {
    "paymentLink": "",
    "name": "Walk-in ",
    "durationMonths": 1,
    "description": [
      "Access to one class"
    ],
    "price": 30
  },
  {
    "name": "Walk-in premium",
    "description": [
      "Access to one class",
      "Yoga Mat Rental"
    ],
    "durationMonths": 1,
    "paymentLink": "",
    "price": 50
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