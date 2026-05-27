'use client';

import React from 'react';
import { Container } from '@/Components/ui/Container';

export default function PrivacyPolicyPage() {
  return (
    <div className="py-20 bg-gray-50/30 min-h-screen">
      <Container>
        <div className="max-w-4xl mx-auto bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100">
          <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">Privacy Policy</h1>
          
          <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">
            <section>
              <p>
                At Kunnath House, we value and respect your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website, make bookings, or interact with us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Information We Collect</h2>
              <p>We may collect personal information such as:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Name</li>
                <li>Phone number</li>
                <li>Email address</li>
                <li>Booking details</li>
                <li>Payment-related information</li>
                <li>Any information voluntarily shared through contact forms or inquiries</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
              <p>The information collected may be used for:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Processing bookings and reservations</li>
                <li>Customer communication and support</li>
                <li>Sending booking confirmations and updates</li>
                <li>Improving our services and guest experience</li>
                <li>Marketing and promotional communication (only when permitted)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Information Protection</h2>
              <p>
                We take reasonable security measures to protect your personal information from unauthorized access, misuse, or disclosure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Security</h2>
              <p>
                Online payments are processed through secure payment gateways. Kunnath House does not store complete debit/credit card details on its servers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Third-Party Sharing</h2>
              <p>
                We do not sell, trade, or rent personal information to third parties. Information may only be shared when required by law or for booking/payment processing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Cookies & Website Usage</h2>
              <p>
                Our website may use cookies and analytics tools to improve user experience and website performance. By using our website, you consent to such usage.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">External Links</h2>
              <p>
                Our website may contain links to third-party websites or social media platforms. Kunnath House is not responsible for the privacy practices or content of external websites.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Policy Updates</h2>
              <p>
                Kunnath House reserves the right to update or modify this Privacy Policy at any time without prior notice. Changes will be updated on this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p>
                For any questions regarding our Privacy Policy, bookings, or data usage, please contact us through the official contact details available on our website.
              </p>
            </section>

            <section className="pt-8 border-t border-gray-100">
              <p className="font-bold text-gray-900">
                By using our website and services, you agree to the terms of this Privacy Policy.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
