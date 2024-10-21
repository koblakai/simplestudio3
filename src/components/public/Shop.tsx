
import React from 'react';
import { config } from '../../config';

const Shop: React.FC = () => {
  if (!config.enableShop) {
    return null;
  }

  // Mock shop items (replace with actual data in production)
  const shopItems = [
    { id: 1, name: 'Premium Yoga Mat', price: 59.99, image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
    { id: 2, name: 'Meditation Cushion', price: 39.99, image: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
    { id: 3, name: 'Yoga Block Set', price: 24.99, image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Shop</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {shopItems.map((item) => (
          <div key={item.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-4">${item.price.toFixed(2)}</p>
              <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-200">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
