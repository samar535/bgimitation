'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Award, Sparkles, Users, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FrontendLayout } from '@/components/layout/FrontendLayout';

export default function AboutPage() {
  const features = [
    {
      icon: Award,
      title: 'Attractive Designs',
      description: 'Stylish imitation jewelry with neat finishing for daily wear and special occasions.'
    },
    {
      icon: ShieldCheck,
      title: 'Genuine Imitation',
      description: 'Imitation jewelry inspired by traditional and modern styles at affordable prices.'
    },
    {
      icon: Truck,
      title: 'Safe Delivery',
      description: 'Carefully packed and delivered across India with order tracking.'
    },
    {
      icon: Heart,
      title: 'Trusted by Customers',
      description: 'Loved for our designs, pricing, and smooth shopping experience.'
    },
  ];

  const values = [
    {
      title: 'Design & Detailing',
      description: 'We focus on attractive designs and neat finishing so you get jewelry that looks beautiful and feels good to wear.',
    },
    {
      title: 'Affordability',
      description: 'We believe stylish jewelry should be affordable. Our imitation pieces are reasonably priced so you can enjoy fashion easily.',
    },
    {
      title: 'Inspired by Tradition',
      description: 'We take inspiration from Indian traditions and blend them with modern designs suitable for daily wear and special occasions.',
    },
    {
      title: 'Customer Satisfaction',
      description: 'Your happiness matters to us. We aim to provide good products, clear communication, and a smooth shopping experience.',
    },
  ];

  return (
    <FrontendLayout>
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-8 sm:py-16 px-4 bg-gradient-to-br from-light via-pink-50 to-purple-50 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-primary/20 text-secondary">
            <Sparkles size={18} />
            <span className="text-sm font-semibold">Since 2025</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-dark font-serif">
            Our Story of
            <br />
            <span className="gradient-text">Style & Simplicity</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            BG Imitation Jewelry started with a simple idea: everyone should be able to enjoy stylish jewelry without spending too much. 
            We offer imitation jewelry inspired by traditional and modern styles, suitable for everyday wear and special occasions.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-accent opacity-10 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-secondary opacity-10 blur-3xl"></div>
      </section>

      {/* Our Mission Section */}
      <section className="py-8 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-dark font-serif">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At BG Imitation, our mission is to make stylish imitation jewelry affordable and easy to wear for everyone. We believe that looking good shouldn’t be expensive.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our collection is thoughtfully selected to suit weddings, festivals, daily wear, and special occasions, so you can find the right piece for every celebration.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products"> <Button>Shop Now</Button> </Link>
                <Link href="/"><Button variant="outline">View Collections</Button></Link>
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
              <div className="hidden md:block absolute -bottom-6 -right-6 w-40 h-40 bg-primary rounded-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-8 sm:py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-dark font-serif">
              Why Choose Us?
            </h2>
            <p className="text-gray-600 text-lg">
              We focus on good designs, fair pricing, and a smooth shopping experience
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

      {/* Our Values */}
      <section className="py-8 sm:py-16 px-4 bg-gradient-to-br from-light to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-dark font-serif">
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
                className="p-4 sm:p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all border-l-4 border-primary"
              >
                <h3 className="text-xl font-bold mb-3 text-dark font-serif">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-md sm:text-lg">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-8 sm:py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-dark font-serif">
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
                location: 'Bundi',
                text: 'Absolutely stunning jewelry! The quality exceeded my expectations. I wore the necklace set to a wedding and received countless compliments.',
                rating: 5,
              },
              {
                name: 'Anjali Patel',
                location: 'Baran',
                text: 'Love the designs! They have such a beautiful collection. The WhatsApp ordering is so convenient. Will definitely buy again!',
                rating: 5,
              },
              {
                name: 'Sneha Reddy',
                location: 'Kota',
                text: 'The best imitation jewelry I\'ve ever purchased. Looks exactly like the real thing! Great prices and fast delivery too.',
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-white to-purple-50 shadow-lg border border-gray-100"
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
      <section className="py-8 sm:py-16 px-4 bg-gradient-to-br from-secondary to-secondary-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 font-serif">
            Ready to Shine?
          </h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-white/90">
            Explore our collection and find the perfect piece for your special moment
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/products">
            <Button size="lg" className="cursor-pointer bg-accent hover:bg-accent/90 text-dark px-4! sm:px-8! py-2! sm:py-4!">
              Shop Now
            </Button>
            </Link>
            <Link href="/contact">
            <Button size="lg" variant="outline" className="cursor-pointer border-white text-white hover:bg-white hover:text-secondary! px-4! sm:px-8! py-2! sm:py-4!">
              Contact Us
            </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white border-t">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl font-bold mb-3 text-dark">Visit Us</h3>
              <p className="text-gray-600">
                Bundi, Rajasthan<br />
                India
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-dark">Contact</h3>
              <p className="text-gray-600">
                +91 9024684467<br />
                bhagawatigoriimitation@gmail.com
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