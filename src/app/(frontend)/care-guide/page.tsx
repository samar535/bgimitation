import React from 'react';
import { Sparkles, Droplet, Sun, Shield, Heart, AlertCircle } from 'lucide-react';
import { FrontendLayout } from '@/components/layout/FrontendLayout';

export default function CareGuidePage() {
  const careItems = [
    {
      icon: Droplet,
      title: 'Keep it Dry',
      description: 'Avoid wearing jewelry while bathing, swimming, or exercising. Water and sweat can tarnish the finish.',
      dos: ['Remove before shower', 'Wipe with soft cloth after wearing', 'Store in dry place'],
      donts: ['Wear while swimming', 'Expose to perfumes', 'Leave in bathroom']
    },
    {
      icon: Sun,
      title: 'Avoid Direct Sunlight',
      description: 'Prolonged exposure to sunlight can cause discoloration and damage to stones.',
      dos: ['Store in dark place', 'Use jewelry box', 'Keep away from windows'],
      donts: ['Leave in car', 'Store near windows', 'Expose to heat']
    },
    {
      icon: Shield,
      title: 'Proper Storage',
      description: 'Store each piece separately to prevent scratches and tangling.',
      dos: ['Use soft pouches', 'Keep in original box', 'Separate different pieces'],
      donts: ['Mix with other jewelry', 'Store without protection', 'Use rough surfaces']
    },
    {
      icon: Sparkles,
      title: 'Regular Cleaning',
      description: 'Clean your jewelry regularly to maintain its shine and luster.',
      dos: ['Use soft cloth', 'Mild soap solution', 'Pat dry gently'],
      donts: ['Use harsh chemicals', 'Scrub aggressively', 'Use rough materials']
    }
  ];

  return (    
    <FrontendLayout>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Heart size={32} />
            <h1 className="text-4xl md:text-5xl font-bold font-serif">
              Jewelry Care Guide
            </h1>
          </div>
          <p className="text-white/90 text-lg max-w-3xl">
            Keep your beautiful jewelry looking as stunning as the day you bought it with these simple care tips.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Introduction */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold mb-4 text-dark font-serif">
            Why Jewelry Care Matters
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            Imitation jewelry is crafted with care to give you the look of fine jewelry at an affordable price. 
            While it may not be made of precious metals, proper care can significantly extend its life and maintain its beauty.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg">
            Follow these simple guidelines to keep your jewelry sparkling for years to come.
          </p>
        </div>

        {/* Care Instructions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {careItems.map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <item.icon size={32} className="text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold text-dark font-serif">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-2 gap-6">
                  {/* Do's */}
                  <div>
                    <h4 className="text-lg font-bold text-green-600 mb-3 flex items-center gap-2">
                      ✅ Do's
                    </h4>
                    <ul className="space-y-2">
                      {item.dos.map((doItem, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">•</span>
                          {doItem}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Don'ts */}
                  <div>
                    <h4 className="text-lg font-bold text-red-600 mb-3 flex items-center gap-2">
                      ❌ Don'ts
                    </h4>
                    <ul className="space-y-2">
                      {item.donts.map((dontItem, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-red-600 mt-0.5">•</span>
                          {dontItem}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cleaning Instructions */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-dark font-serif">
            How to Clean Your Jewelry
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
              <div className="text-4xl mb-3">1️⃣</div>
              <h3 className="text-xl font-bold mb-2 text-dark">Prepare Solution</h3>
              <p className="text-gray-700 text-sm">
                Mix lukewarm water with a few drops of mild dish soap in a bowl.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
              <div className="text-4xl mb-3">2️⃣</div>
              <h3 className="text-xl font-bold mb-2 text-dark">Gentle Cleaning</h3>
              <p className="text-gray-700 text-sm">
                Dip soft cloth in solution and gently wipe your jewelry. Use soft brush for intricate designs.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
              <div className="text-4xl mb-3">3️⃣</div>
              <h3 className="text-xl font-bold mb-2 text-dark">Dry Properly</h3>
              <p className="text-gray-700 text-sm">
                Rinse with clean water and pat dry with soft, lint-free cloth. Let it air dry completely.
              </p>
            </div>
          </div>
        </div>

        {/* Warning Box */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-2xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <AlertCircle size={32} className="text-red-500 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-2 text-dark">⚠️ Important Warning</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Never use harsh chemicals, bleach, or abrasive cleaners</li>
                <li>• Avoid ultrasonic cleaners for imitation jewelry</li>
                <li>• Don't submerge jewelry with glued components</li>
                <li>• Keep away from hairspray, perfume, and lotions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Storage Tips */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-dark font-serif">
            Storage Best Practices
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-secondary">Ideal Storage</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <span className="text-gray-700">Use individual soft pouches or jewelry boxes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <span className="text-gray-700">Keep in cool, dry place away from sunlight</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <span className="text-gray-700">Store necklaces flat or hanging to prevent tangles</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <span className="text-gray-700">Use anti-tarnish strips in storage containers</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-red-600">Avoid These</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 text-xl">✗</span>
                  <span className="text-gray-700">Storing multiple pieces together</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 text-xl">✗</span>
                  <span className="text-gray-700">Leaving in humid areas (bathroom, kitchen)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 text-xl">✗</span>
                  <span className="text-gray-700">Direct contact with wood or cardboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 text-xl">✗</span>
                  <span className="text-gray-700">Exposure to extreme temperatures</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-primary to-secondary text-white rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Need More Help?</h3>
          <p className="text-white/90 mb-6">
            Have questions about caring for your jewelry? We're here to help!
          </p>
          <a 
            href="/contact"
            className="inline-block px-8 py-4 bg-white text-secondary rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
    </FrontendLayout>
  );
}