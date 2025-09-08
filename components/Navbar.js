'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

export default function Navbar() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    // Set isClient to true after component mounts
    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push('/auth/login');
        setIsMobileMenuOpen(false); // Close mobile menu after sign out
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Show loading state until we know the session status
    if (!isClient) {
        return (
            <nav className="bg-gray-800 shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <Link href="/">
                            <div className="flex items-center cursor-pointer">
                                <span className="text-2xl font-bold text-white">WriteHub</span>
                            </div>
                        </Link>
                        <div className="hidden md:flex md:items-center md:space-x-6">
                            <div className="h-6 w-20 bg-gray-700 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-gray-800 shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link href="/">
                        <div className="flex items-center cursor-pointer">
                            <span className="text-2xl font-bold text-white">WriteHub</span>
                        </div>
                    </Link>
                    {/* Hamburger Menu Button for Mobile */}
                    <button
                        className="md:hidden text-white focus:outline-none"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
                    </button>
                    {/* Desktop Menu */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        <Link href="/" prefetch={true}>
                            <span className="text-gray-200 hover:text-blue-400 transition-colors duration-200">Home</span>
                        </Link>
                        <Link href="/about" prefetch={true}>
                            <span className="text-gray-200 hover:text-blue-400 transition-colors duration-200">About</span>
                        </Link>
                        <Link href="/contact" prefetch={true}>
                            <span className="text-gray-200 hover:text-blue-400 transition-colors duration-200">Contact</span>
                        </Link>
                        {status === 'loading' ? (
                            <div className="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
                        ) : session ? (
                            <>
                                <Link href="/dashboard" prefetch={true}>
                                    <span className="text-gray-200 hover:text-blue-400 transition-colors duration-200">Dashboard</span>
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <Link href="/auth/login" prefetch={true}>
                                <span className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200">
                                    Sign In
                                </span>
                            </Link>
                        )}
                    </div>
                </div>
                {/* Mobile Menu */}
                <div
                    className={`md:hidden mt-4 space-y-4 transition-all duration-300 ease-in-out ${
                        isMobileMenuOpen ? 'block' : 'hidden'
                    }`}
                >
                    <Link href="/" prefetch={true} onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="block text-gray-200 hover:text-blue-400 py-2 transition-colors duration-200">Home</span>
                    </Link>
                    <Link href="/about" prefetch={true} onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="block text-gray-200 hover:text-blue-400 py-2 transition-colors duration-200">About</span>
                    </Link>
                    <Link href="/contact" prefetch={true} onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="block text-gray-200 hover:text-blue-400 py-2 transition-colors duration-200">Contact</span>
                    </Link>
                    {status === 'loading' ? (
                        <div className="h-8 w-full bg-gray-700 rounded animate-pulse"></div>
                    ) : session ? (
                        <>
                            <Link href="/dashboard" prefetch={true} onClick={() => setIsMobileMenuOpen(false)}>
                                <span className="block text-gray-200 hover:text-blue-400 py-2 transition-colors duration-200">Dashboard</span>
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="w-full text-left px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <Link href="/auth/login" prefetch={true} onClick={() => setIsMobileMenuOpen(false)}>
                            <span className="block px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200">
                                Sign In
                            </span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}