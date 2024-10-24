
export interface PricingPlan {
  name: string;
  price: number;
  description: string[];
}

export interface Config {
  studioName: string;
  locations: any[];
  socialMedia: any[];
  enableBlog: boolean;
  enableShop: boolean;
  landingPageImage: string;
  pricing: PricingPlan[]; // Include pricing in the type definition
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
    "description": [
      "Access to all classes for one year "
    ],
    "price": 999
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
    "price": 30,
    "paymentLink": "",
    "name": "Walk-in ",
    "description": [
      "Access to one class"
    ]
  },
  {
    "name": "Walk-in premium",
    "paymentLink": "",
    "description": [
      "Access to one class",
      "Yoga Mat Rental"
    ],
    "durationMonths": 1,
    "price": 50
  }
], // Add pricing to the config object
};
