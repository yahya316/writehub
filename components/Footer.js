'use client';

import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white pb-2 pt-8 mt-12 border-t border-gray-800">
            <div className="container mx-auto px-6 py-4 md:grid md:grid-cols-4 gap-4">
                {/* Logo and Description */}
                <div className="col-span-1 mb-4 md:mb-0">
                    <h3 className="text-xl md:text-2xl font-bold text-indigo-400 mb-2">WriteHub</h3>
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                        Empowering creators with a platform to share stories, articles, and poems. Join our community today!
                    </p>
                </div>

                <div className="sm:col-span-3 sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                    {/* Navigation Links */}
                    <div className="col-span-1 mb-4 sm:mb-0">
                        <h4 className="text-md md:text-lg font-semibold text-gray-200 mb-2">Quick Links</h4>
                        <ul className="space-y-1">
                            <li>
                                <a href="/about" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 text-xs md:text-sm">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 text-xs md:text-sm">
                                    Contact
                                </a>
                            </li>
                            <li>
                                <a href="/dashboard" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 text-xs md:text-sm">
                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a href="/terms" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 text-xs md:text-sm">
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div className="col-span-1 mb-4 sm:mb-0">
                        <h4 className="text-md md:text-lg font-semibold text-gray-200 mb-2">Connect With Us</h4>
                        <div className="flex space-x-3">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                                <FaFacebook className="w-5 h-5 md:w-6 md:h-6" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                                <FaTwitter className="w-5 h-5 md:w-6 md:h-6" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                                <FaInstagram className="w-5 h-5 md:w-6 md:h-6" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                                <FaLinkedin className="w-5 h-5 md:w-6 md:h-6" />
                            </a>
                        </div>
                    </div>

                    {/* Newsletter Signup */}
                    <div className="col-span-2 lg:col-span-1">
                        <h4 className="text-md md:text-lg font-semibold text-gray-200 mb-2">Stay Updated</h4>
                        <p className="text-gray-400 text-xs md:text-sm mb-2">Subscribe to our newsletter for the latest updates.</p>
                        <form className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="px-4 py-2 bg-gray-800 text-gray-200 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 w-full"
                                required
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors duration-200 w-full sm:w-auto flex items-center justify-center gap-2"
                            >
                                <FaEnvelope className="w-4 h-4" />
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="container mx-auto px-6 py-2 border-t border-gray-800 text-center text-gray-500 text-xs md:text-sm">
                <p>
                    &copy; {new Date().getFullYear()} WriteHub. All rights reserved. | Designed in Pakistan.
                </p>
            </div>
        </footer>
    );
}