import React from 'react';
import { config } from '../../config';

const Blog: React.FC = () => {
  if (!config.enableBlog) return null;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Blog</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Blog content */}
      </div>
    </div>
  );
};

export default Blog;