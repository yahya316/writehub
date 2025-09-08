'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPaperPlane } from 'react-icons/fa';

// Dynamically import Google Maps iframe for client-side rendering
const GoogleMap = dynamic(() => import('react').then(() => ({ children }) => (
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3400.1234567890123!2d74.3587!3d31.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDMxJzEzLjQiTiA3NMKwMjEnMzQuMiJF!5e0!3m2!1sen!2spk!4v1693824000!5m2!1sen!2spk"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  >
    {children}
  </iframe>
)), { ssr: false });

const ContactPage = () =>  {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      // Simulate API call to Next.js API route
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) throw new Error('Failed to send message.');

      setStatus('Message sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => {
        setStatus('');
        router.push('/'); // Redirect to home page after successful submission
      }, 3000);
    } catch (err) {
      setStatus('Failed to send message. Please try again.');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const companyDetails = {
    address: '123 Creativity Lane, Lahore, Punjab, Pakistan',
    phone: '+92 123 456 7890',
    email: 'support@writehub.com',
  };

  const socialLinks = [
    { icon: FaFacebookF, href: 'https://facebook.com', color: 'hover:text-gray-400' },
    { icon: FaTwitter, href: 'https://twitter.com', color: 'hover:text-gray-400' },
    { icon: FaInstagram, href: 'https://instagram.com', color: 'hover:text-gray-400' },
    { icon: FaLinkedinIn, href: 'https://linkedin.com', color: 'hover:text-gray-400' },
  ];

  const officeLocations = [
    { city: 'Lahore', address: '123 Creativity Lane, Lahore, Punjab, Pakistan' },
    { city: 'Karachi', address: '456 Innovation St, Karachi, Sindh, Pakistan' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-300 text-gray-800 font-sans antialiased">
      {/* Header with Background Image */}
      <header className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
        <Image
          src="/img3.jpg" // Replace with your actual image path in public/
          alt="Contact Header Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
          quality={80}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800/70 to-gray-900/70"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Get in Touch</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
            We&apos;d love to hear from you. Let's start a conversation.
          </p>
          <Link href="/" prefetch={true} className="mt-4 text-gray-300 hover:text-white transition-colors duration-200">
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 relative inline-block">
                Contact Information
              </h2>
              <p className="text-gray-600 mb-8">
                Have questions or want to collaborate? Reach out to us through any of these channels.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 bg-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="bg-gray-300 p-3 rounded-full">
                  <FaMapMarkerAlt className="text-gray-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Our Address</h3>
                  <p className="text-gray-600">{companyDetails.address}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="bg-gray-300 p-3 rounded-full">
                  <FaPhone className="text-gray-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Phone Number</h3>
                  <p className="text-gray-600">{companyDetails.phone}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="bg-gray-300 p-3 rounded-full">
                  <FaEnvelope className="text-gray-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Email Address</h3>
                  <p className="text-gray-600">{companyDetails.email}</p>
                </div>
              </div>
            </div>

            {/* Office Locations */}
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Offices</h3>
              <div className="space-y-4">
                {officeLocations.map((location, index) => (
                  <div key={index} className="p-4 bg-gray-100 rounded-xl shadow-sm">
                    <h4 className="font-medium text-gray-700">{location.city}</h4>
                    <p className="text-gray-600 text-sm">{location.address}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={index}
                      href={link.href}
                      prefetch={false} // External links don't need prefetch
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`bg-gray-100 p-3 rounded-full shadow-sm text-gray-600 ${link.color} transition-all duration-300 hover:shadow-md`}
                      aria-label={`Follow us on ${link.href}`}
                    >
                      <Icon className="w-5 h-5" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-100 rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
            <p className="text-gray-600 mb-8">Fill out the form below and we will get back to you as soon as possible.</p>

            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                  placeholder="How can we help you?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium rounded-lg hover:from-gray-700 hover:to-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-80"
                disabled={status === 'Sending...'}
              >
                {status === 'Sending...' ? (
                  <>
                    <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : status.includes('successfully') ? (
                  'Sent Successfully'
                ) : (
                  <>
                    <FaPaperPlane className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>

              {status && status !== 'Sending...' && (
                <p className={`text-center text-sm ${status.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                  {status}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Find Us</h2>
          <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">
            <GoogleMap />
          </div>
        </section>
      </main>
    </div>
  );
}

export default ContactPage;