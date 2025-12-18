'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, Award, Sparkles, Users, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FrontendLayout } from '@/components/layout/FrontendLayout';

export default function AboutPage() {
  const features = [
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Handcrafted with precision and attention to detail. Every piece is quality checked.'
    },
    {
      icon: ShieldCheck,
      title: '100% Authentic',
      description: 'Genuine imitation jewelry with authentic designs inspired by traditional craftsmanship.'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and secure delivery across India. Track your order every step of the way.'
    },
    {
      icon: Heart,
      title: 'Customer Love',
      description: 'Thousands of happy customers trust us for their jewelry needs. Join our family!'
    },
  ];

  const values = [
    {
      title: 'Craftsmanship',
      description: 'Each piece is meticulously crafted by skilled artisans who pour their heart into every design.',
    },
    {
      title: 'Affordability',
      description: 'Luxury shouldn\'t break the bank. We offer premium quality at prices that make sense.',
    },
    {
      title: 'Tradition',
      description: 'We celebrate Indian heritage by creating designs that blend traditional aesthetics with modern style.',
    },
    {
      title: 'Trust',
      description: 'Your satisfaction is our priority. We build lasting relationships based on trust and quality.',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '500+', label: 'Unique Designs' },
    { number: '5 Star', label: 'Average Rating' },
    { number: '100%', label: 'Satisfaction' },
  ];

  return (
    <FrontendLayout>
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-light via-pink-50 to-purple-50 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-primary/20 text-secondary">
            <Sparkles size={18} />
            <span className="text-sm font-semibold">Since 2024</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-dark font-serif">
            Our Story of
            <br />
            <span className="gradient-text">Elegance & Passion</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            BG Imitation Jewelry was born from a simple belief: everyone deserves to wear beautiful jewelry. 
            We bring you exquisite designs that capture the essence of tradition while embracing modern elegance.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-accent opacity-10 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-secondary opacity-10 blur-3xl"></div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-dark font-serif">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At BG Imitation, we're on a mission to make premium quality jewelry accessible to everyone. 
                We believe that beauty and elegance shouldn't be limited by budget.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Every piece in our collection is carefully curated and crafted to bring joy to your special moments. 
                From weddings to festivals, from daily wear to special occasions – we have something for every celebration.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button>Shop Now</Button>
                <Button variant="outline">View Collections</Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop"
                  alt="Jewelry craftsmanship"
                  width={800}
                  height={800}
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-primary rounded-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-dark font-serif">
              Why Choose Us?
            </h2>
            <p className="text-gray-600 text-lg">
              We're committed to delivering excellence in every aspect
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-gradient-to-br from-white to-pink-50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border border-gray-100"
              >
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <feature.icon size={32} className="text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-dark">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-secondary to-secondary-dark text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl md:text-6xl font-bold mb-2 text-accent">
                  {stat.number}
                </div>
                <div className="text-lg text-white/90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-dark font-serif">
              Our Core Values
            </h2>
            <p className="text-gray-600 text-lg">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all border-l-4 border-primary"
              >
                <h3 className="text-2xl font-bold mb-3 text-dark font-serif">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-light to-pink-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-dark font-serif">
            Meet Our Team
          </h2>
          <p className="text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
            A passionate team dedicated to bringing you the finest jewelry designs and exceptional customer service.
          </p>

          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-lg">
            <Users size={24} className="text-secondary" />
            <span className="text-lg font-semibold text-gray-800">
              50+ Dedicated Team Members
            </span>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-dark font-serif">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 text-lg">
              Real stories from real people who love our jewelry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                location: 'Mumbai',
                text: 'Absolutely stunning jewelry! The quality exceeded my expectations. I wore the necklace set to a wedding and received countless compliments.',
                rating: 5,
              },
              {
                name: 'Anjali Patel',
                location: 'Ahmedabad',
                text: 'Love the designs! They have such a beautiful collection. The WhatsApp ordering is so convenient. Will definitely buy again!',
                rating: 5,
              },
              {
                name: 'Sneha Reddy',
                location: 'Hyderabad',
                text: 'The best imitation jewelry I\'ve ever purchased. Looks exactly like the real thing! Great prices and fast delivery too.',
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-gradient-to-br from-white to-purple-50 shadow-lg border border-gray-100"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-accent text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div className="border-t pt-4">
                  <p className="font-bold text-dark">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-secondary to-secondary-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
            Ready to Shine?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Explore our collection and find the perfect piece for your special moment
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-dark">
              Shop Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-secondary">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 px-4 bg-white border-t">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl font-bold mb-3 text-dark">Visit Us</h3>
              <p className="text-gray-600">
                Kota, Rajasthan<br />
                India
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-dark">Contact</h3>
              <p className="text-gray-600">
                +91 98765 43210<br />
                info@bgjewelry.com
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-dark">Hours</h3>
              <p className="text-gray-600">
                Monday - Saturday<br />
                10:00 AM - 8:00 PM
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </FrontendLayout>
  );
}