'use client';

import React from 'react';
import { Container } from '@/Components/ui/Container';

export default function TermsAndConditionsPage() {
  return (
    <div className="py-20 bg-gray-50/30 min-h-screen">
      <Container>
        <div className="max-w-4xl mx-auto bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100">
          <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">Terms & Conditions</h1>
          
          <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Reservations Policy</h2>
              <ul className="list-disc pl-5 space-y-4">
                <li>Bookings will be confirmed only upon receipt of 50% payment in advance.</li>
                <li>The remaining balance amount, including a refundable security deposit of Rs. 5,000 (Five Thousand Only), must be paid in full before check-in.</li>
                <li>The security deposit will be refunded after check-out, subject to inspection and in the absence of any damages or policy violations.</li>
                <li>Guests are requested to carry a valid government-issued ID proof during check-in.</li>
              </ul>
            </section>

            <section className="pt-8 border-t border-gray-100">
              <p className="font-bold text-gray-900">
                By confirming the booking, guests agree to comply with the booking terms and property policies of Kunnath House.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
