'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FaPenNib, FaUsers, FaBookOpen, FaHeart } from 'react-icons/fa';
import { BiBook, BiGroup, BiWorld, BiStar } from 'react-icons/bi';

const TeamSection = dynamic(() => Promise.resolve(({ teamMembers }) => (
  <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
    {teamMembers.map((member, index) => (
      <div key={index} className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <Image
            src={member.image}
            alt={`${member.name} portrait`}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-full"
            quality={80}
            onError={(e) => {
              e.target.src = '/placeholder-avatar.png'; // Fallback if image fails to load
            }}
          />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{member.name}</h3>
        <p className="text-gray-600 font-medium mb-2">{member.role}</p>
        <p className="text-gray-600 text-sm">{member.bio}</p>
      </div>
    ))}
  </div>
)), { ssr: false });

export default function AboutPage() {
  const router = useRouter();

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & Editor',
      bio: 'Literature enthusiast with 10+ years in publishing',
      image: '/img5.jpg',
    },
    {
      name: 'Michael Chen',
      role: 'Tech Lead',
      bio: 'Full-stack developer passionate about creator platforms',
      image: '/img4.jpg',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Community Manager',
      bio: 'Connecting writers and readers since 2018',
      image: '/img3.jpg',
    },
  ];

  const stats = [
    { icon: BiBook, number: '10K+', label: 'Published Stories' },
    { icon: BiGroup, number: '5K+', label: 'Active Writers' },
    { icon: BiWorld, number: '100+', label: 'Countries' },
    { icon: BiStar, number: '50K+', label: 'Monthly Readers' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 to-gray-300">
      {/* Hero Section with Background Image */}
      <section className="relative py-16 text-white">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/img4.jpg" // Replace with your background image path
            alt="Background"
            fill
            style={{ objectFit: 'cover' }}
            quality={90}
            priority
          />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About WriteHub</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 opacity-90">
            Where stories find their voice and writers find their audience
          </p>
          <div className="w-20 h-1 bg-gray-200 mx-auto mb-12"></div>
          <Link href="/" prefetch={true} className="text-gray-300 hover:text-white transition-colors duration-200">
            Back to Home
          </Link>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-300 rounded-full mb-6">
              <FaPenNib className="w-8 h-8 text-gray-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              At WriteHub, we believe every story deserves to be told and every voice deserves to be heard. 
              We're building a platform that empowers writers to share their work with the world and connects 
              readers with captivating content across countless genres and topics.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our mission is to create the most welcoming and supportive community for writers and readers alike, 
              where creativity flourishes and stories find their perfect audience.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-gray-100 rounded-xl shadow-lg">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-300 rounded-full mb-4">
                  <stat.icon className="w-6 h-6 text-gray-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-300 rounded-full mb-6">
              <FaHeart className="w-8 h-8 text-gray-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-gray-100 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Community First</h3>
              <p className="text-gray-600">
                We prioritize building a supportive environment where writers can grow and readers can discover amazing content.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-100 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBookOpen className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Quality Content</h3>
              <p className="text-gray-600">
                We're committed to maintaining high standards while celebrating diverse voices and writing styles.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-100 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <BiWorld className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Accessibility</h3>
              <p className="text-gray-600">
                We believe great writing should be accessible to everyone, everywhere, without barriers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Passionate individuals working together to make WriteHub the best platform for writers and readers
            </p>
          </div>

          <TeamSection teamMembers={teamMembers} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-600 to-gray-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Whether you're a writer or a reader, there's a place for you at WriteHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" prefetch={true}>
              <span className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-lg hover:bg-gray-300 transition-all duration-300">
                Sign Up Now
              </span>
            </Link>
            <Link href="/stories" prefetch={true}>
              <span className="px-8 py-3 border-2 border-gray-200 text-gray-200 font-semibold rounded-lg hover:bg-gray-200/10 transition-all duration-300">
                Explore Stories
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}