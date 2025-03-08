import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-primary to-accent rounded-lg text-white">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Discover and Book the Best Restaurants
          </h1>
          <p className="text-lg mb-8">
            Find your perfect dining experience and make reservations with ease.
          </p>
          <Link to="/restaurants" className="btn-secondary bg-white text-primary hover:bg-gray-100">
            Explore Restaurants
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <h2 className="section-title text-center mb-12">Why Choose DineEase?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="text-primary text-4xl mb-4">
              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Availability</h3>
            <p className="text-gray-600">See available time slots instantly and book your table in seconds.</p>
          </div>
          <div className="card text-center">
            <div className="text-primary text-4xl mb-4">
              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Verified Reviews</h3>
            <p className="text-gray-600">Read authentic reviews from real diners to make informed decisions.</p>
          </div>
          <div className="card text-center">
            <div className="text-primary text-4xl mb-4">
              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Bookmarking</h3>
            <p className="text-gray-600">Save your favorite restaurants and get personalized recommendations.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary text-white rounded-lg p-12 text-center">
        <h2 className="text-3xl font-display font-bold mb-6">Ready to Experience Great Dining?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of food lovers who trust DineEase for their dining experiences.
        </p>
        <div className="space-x-4">
          <Link to="/register" className="btn-primary bg-white text-secondary hover:bg-gray-100">
            Sign Up Now
          </Link>
          <Link to="/restaurants" className="btn-secondary border-2 border-white hover:bg-secondary">
            Browse Restaurants
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;