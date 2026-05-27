'use client';

import React from 'react';
import { Container } from '@/Components/ui/Container';

export default function RefundPolicyPage() {
  return (
    <div className="py-20 bg-gray-50/30 min-h-screen">
      <Container>
        <div className="max-w-4xl mx-auto bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100">
          <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">Cancellation & Refund Policy</h1>
          
          <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">
            <section>
              <p>
                At Kunnath House, we understand that plans may change. To ensure smooth booking management and fair availability for all guests, the following cancellation policy applies:
              </p>
            </section>

            <section>
              <ul className="list-disc pl-5 space-y-4">
                <li>
                  <span className="font-bold text-gray-900">100% Refund:</span> Cancellations made 7 days prior to the check-in date.
                </li>
                <li>
                  <span className="font-bold text-gray-900">50% Refund:</span> Cancellations made within 2 days prior to check-in.
                </li>
                <li>
                  <span className="font-bold text-gray-900">No Refund:</span> Cancellations made within 48 hours of the check-in time.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Refund Processing</h2>
              <ul className="list-disc pl-5 space-y-4">
                <li>Eligible refunds will be processed within 5–7 working days to the original mode of payment.</li>
                <li>Eligible refundable security deposits will be transferred to the original payment method at the time of check-out.</li>
              </ul>
            </section>

            <section className="pt-8 border-t border-gray-100">
              <p className="font-bold text-gray-900">
                By confirming the booking, guests agree to the above cancellation and refund terms.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
