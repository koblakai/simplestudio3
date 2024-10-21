
import React from 'react';
import { config } from '../../config';

const Blog: React.FC = () => {
  if (!config.enableBlog) {
    return null;
  }

  // Mock blog posts (replace with actual data in production)
  const blogPosts = [
    { id: 1, title: 'The Benefits of Daily Yoga Practice', excerpt: 'Discover how incorporating yoga into your daily routine can transform your physical and mental well-being...', date: '2024-03-10' },
    { id: 2, title: 'Mindfulness Meditation Techniques', excerpt: 'Learn simple yet effective mindfulness meditation techniques to reduce stress and increase focus...', date: '2024-03-05' },
    { id: 3, title: 'Yoga for Beginners: Getting Started', excerpt: 'New to yoga? This guide will help you begin your yoga journey with confidence and ease...', date: '2024-02-28' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Latest Blog Posts</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <div key={post.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <p className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
            </div>
            <div className="bg-gray-50 px-6 py-4">
              <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">Read more</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
