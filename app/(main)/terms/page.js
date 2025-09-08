'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaBalanceScale, FaShieldAlt, FaExclamationTriangle, FaCopyright } from 'react-icons/fa';

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 to-gray-300">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-gray-600 to-gray-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-500 rounded-full mb-6">
            <FaBalanceScale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 opacity-90">
            Guidelines for using WriteHub and protecting our community
          </p>
          <div className="w-20 h-1 bg-gray-200 mx-auto mb-12"></div>
          <Link href="/" prefetch={true} className="text-gray-300 hover:text-white transition-colors duration-200">
            Back to Home
          </Link>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <p className="text-gray-600 mb-6">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <p className="text-gray-700 mb-8">
              Welcome to WriteHub! These Terms of Service govern your use of our website and services. By accessing or using WriteHub, you agree to be bound by these Terms and our Privacy Policy.
            </p>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FaShieldAlt className="mr-3 text-gray-600" />
                1. Account Registration and Security
              </h2>
              <div className="pl-10">
                <p className="text-gray-700 mb-4">
                  To access certain features of WriteHub, you must register for an account. When registering, you agree to:
                </p>
                <ul className="list-disc pl-5 text-gray-700 mb-4">
                  <li className="mb-2">Provide accurate, current, and complete information</li>
                  <li className="mb-2">Maintain the security of your password and accept all risks of unauthorized access</li>
                  <li className="mb-2">Notify us immediately if you discover or suspect any security breaches related to our services</li>
                  <li>Be responsible for all activities that occur under your account</li>
                </ul>
                <p className="text-gray-700">
                  WriteHub reserves the right to refuse service, terminate accounts, or remove content at our discretion.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FaCopyright className="mr-3 text-gray-600" />
                2. Intellectual Property Rights
              </h2>
              <div className="pl-10">
                <p className="text-gray-700 mb-4">
                  <span className="font-semibold">Your Content:</span> You retain all ownership rights to the content you create and share on WriteHub. By posting content, you grant WriteHub a worldwide, non-exclusive, royalty-free license to use, distribute, reproduce, and display your content in connection with providing our services.
                </p>
                <p className="text-gray-700 mb-4">
                  <span className="font-semibold">Our Content:</span> All rights, title, and interest in and to the WriteHub services (excluding content provided by users) are and will remain the exclusive property of WriteHub and its licensors.
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Copyright Complaints:</span> WriteHub respects copyright law and expects our users to do the same. If you believe that content on our platform infringes your copyright, please contact us at copyright@writehub.com.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FaExclamationTriangle className="mr-3 text-gray-600" />
                3. Acceptable Use Policy
              </h2>
              <div className="pl-10">
                <p className="text-gray-700 mb-4">You agree not to use WriteHub to:</p>
                <ul className="list-disc pl-5 text-gray-700 mb-4">
                  <li className="mb-2">Post any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
                  <li className="mb-2">Impersonate any person or entity or falsely state or misrepresent your affiliation with a person or entity</li>
                  <li className="mb-2">Engage in any activity that interferes with or disrupts the WriteHub service or servers</li>
                  <li className="mb-2">Attempt to gain unauthorized access to any accounts, computer systems, or networks</li>
                  <li>Collect or store personal data about other users without their express permission</li>
                </ul>
                <p className="text-gray-700">
                  Violation of these guidelines may result in termination of your account and removal of your content.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Disclaimer of Warranties</h2>
              <div className="pl-10">
                <p className="text-gray-700 mb-4">
                  The WriteHub service is provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
                </p>
                <p className="text-gray-700">
                  WriteHub does not guarantee that the service will be uninterrupted, timely, secure, or error-free, or that any defects will be corrected.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Limitation of Liability</h2>
              <div className="pl-10">
                <p className="text-gray-700">
                  To the fullest extent permitted by law, WriteHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
                </p>
                <ul className="list-disc pl-5 text-gray-700 mt-4">
                  <li className="mb-2">Your access to or use of or inability to access or use the services</li>
                  <li className="mb-2">Any conduct or content of any third party on the services</li>
                  <li className="mb-2">Unauthorized access, use, or alteration of your transmissions or content</li>
                  <li>Any other matter relating to the services</li>
                </ul>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Governing Law</h2>
              <div className="pl-10">
                <p className="text-gray-700">
                  These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms will be brought exclusively in the federal or state courts located in San Francisco County, California.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Changes to Terms</h2>
              <div className="pl-10">
                <p className="text-gray-700">
                  WriteHub reserves the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Contact Information</h2>
              <div className="pl-10">
                <p className="text-gray-700">
                  If you have any questions about these Terms, please contact us at:
                </p>
                  <p className="text-gray-700 mt-2">
                  WriteHub Support<br />
                  support@writehub.com<br />
                  123 Story Avenue, San Francisco, CA 94110
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/about" prefetch={true}>
              <span className="inline-block px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-800 transition-all duration-300">
                Learn More About Us
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-gradient-to-r from-gray-600 to-gray-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Questions About Our Terms?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Our support team is here to help you understand our policies
          </p>
          <Link href="/contact" prefetch={true}>
            <span className="inline-block px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-lg hover:bg-gray-300 transition-all duration-300">
              Contact Support
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}