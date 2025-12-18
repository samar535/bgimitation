'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { FrontendLayout } from '@/components/layout/FrontendLayout';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Generate WhatsApp message
    const whatsappMessage = `*New Contact Form Submission*

    Name: ${formData.name}
    Email: ${formData.email}
    Phone: ${formData.phone}

    Message:
    ${formData.message}`;

    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919024684467';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    setTimeout(() => {
      window.open(url, '_blank');
      toast.success('Redirecting to WhatsApp...');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setLoading(false);
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <FrontendLayout>
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-dark font-serif">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600">
            Have questions? We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-dark">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
              />

              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+91 98765 43210"
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                  placeholder="Tell us about your inquiry..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary outline-none transition-colors"
                />
              </div>

              <Button type="submit" loading={loading} className="w-full cursor-pointer">
                <Send size={20} />
                Send Message via WhatsApp
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Info Card */}
            <div className="bg-gradient-to-br from-primary to-accent text-white rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-white/90">+91 90246 84467</p>
                    <p className="text-sm text-white/80 mt-1">Mon-Sat, 10AM-8PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-white/90">info@bgjewelry.com</p>
                    <p className="text-sm text-white/80 mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-white/90">Kota, Rajasthan</p>
                    <p className="text-sm text-white/80 mt-1">India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-dark">Quick Links</h2>
              <div className="space-y-3">
                <a href="/products" className="block text-gray-700 hover:text-secondary transition-colors">
                  → Browse Products
                </a>
                <a href="/about" className="block text-gray-700 hover:text-secondary transition-colors">
                  → About Us
                </a>
                <a href="/care-guide" className="block text-gray-700 hover:text-secondary transition-colors">
                  → Care Guide
                </a>
                <a href="/shipping" className="block text-gray-700 hover:text-secondary transition-colors">
                  → Shipping Information
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </FrontendLayout>
  );
}