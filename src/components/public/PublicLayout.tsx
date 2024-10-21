
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { config } from '../../config';
import Home from './Home';
import Pricing from './Pricing';
import ClassSchedule from './ClassSchedule';
import Blog from './Blog';
import Shop from './Shop';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-indigo-600">{config.studioName}</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Home
                </Link>
                <Link to="/pricing" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Pricing
                </Link>
                <Link to="/schedule" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Class Schedule
                </Link>
                {config.enableBlog && (
                  <Link to="/blog" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Blog
                  </Link>
                )}
                {config.enableShop && (
                  <Link to="/shop" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Shop
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/schedule" element={<ClassSchedule />} />
          {config.enableBlog && <Route path="/blog" element={<Blog />} />}
          {config.enableShop && <Route path="/shop" element={<Shop />} />}
        </Routes>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">&copy; {new Date().getFullYear()} {config.studioName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
