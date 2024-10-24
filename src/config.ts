
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  description: string[];
  durationMonths: number;
  paymentLink?: string;  // Make paymentLink optional with ?
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

export const config: Config = {
  studioName: "Simple Studio",
  locations: [],
  socialMedia: [],
  enableBlog: false,
  enableShop: false,
  landingPageImage: "https://images.unsplash.com/photo-1524863479829-916d8e77f114?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
  pricing: [
  {
    "price": 80,
    "description": [
      "Access to all class for one month"
    ],
    "name": "Monthly Unlimited"
  },
  {
    "name": "Monthly Premium",
    "price": 120,
    "description": [
      "Access to all classes for one month",
      "Yoga mat rental"
    ]
  },
  {
    "description": [
      "Access to all classes for one year "
    ],
    "price": 999,
    "name": "Yearly Unlimited"
  },
  {
    "description": [
      "Access to All Classes",
      "Mat Rental",
      "Access to 2 Specialized Workshops"
    ],
    "price": 1199,
    "name": "Yearly Premium"
  },
  {
    "paymentLink": "",
    "price": 30,
    "durationMonths": 1,
    "name": "Walk-in ",
    "description": [
      "Access to one class"
    ]
  },
  {
    "paymentLink": "",
    "description": [
      "Access to one class",
      "Yoga Mat Rental"
    ],
    "durationMonths": 1,
    "name": "Walk-in premium",
    "price": 50
  }
],
};
