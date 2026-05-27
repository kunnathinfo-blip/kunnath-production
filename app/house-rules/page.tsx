'use client';

import React from 'react';
import { Container } from '@/Components/ui/Container';

export default function HouseRulesPage() {
  return (
    <div className="py-20 bg-gray-50/30 min-h-screen">
      <Container>
        <div className="max-w-4xl mx-auto bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100">
          <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">House Rules & Regulations</h1>
          
          <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">
            <section>
              <p>
                To ensure a safe, comfortable, and enjoyable experience for all guests, we kindly request everyone to follow the house rules mentioned below:
              </p>
            </section>

            <section>
              <ul className="list-disc pl-5 space-y-4">
                <li>Check-in and check-out timings must be strictly followed. Early check-in or late check-out is subject to availability and additional charges.</li>
                <li>Guests must carry valid government-issued ID proof during check-in.</li>
                <li>Outside illegal substances, weapons, or prohibited activities are strictly not allowed on the property.</li>
                <li>Loud music and noise levels should be maintained responsibly, especially during late-night hours, to avoid disturbance to neighboring properties.</li>
                <li>Guests are requested to maintain cleanliness and take care of the property, furniture, pool area, sports facilities, and equipment.</li>
                <li>Any damages caused to the property, appliances, furnishings, or recreational equipment will be charged accordingly.</li>
                <li>Pool usage is at guests’ own risk. Children must be supervised by adults at all times near the swimming pool and activity areas.</li>
                <li>Consumption of alcohol is permitted strictly as per Telangana State Excise Government norms and regulations. Guests are requested to consume responsibly and avoid any nuisance or misconduct on the property.</li>
                <li>Management will not be responsible for accidents caused due to negligence, misconduct, or irresponsible behavior.</li>
                <li>Smoking is permitted only in designated outdoor areas. Please avoid smoking inside rooms and halls.</li>
                <li>Pets are allowed only with prior approval from the management.</li>
                <li>Additional extra or floating guests beyond the confirmed booking count may incur Rs. 500 extra charges per member or may not be permitted without prior approval.</li>
                <li>Sticking, pinning, taping, painting, or decorating walls and property surfaces is strictly not permitted. Any damages caused due to decorations will be charged accordingly.</li>
                <li>Guests are requested to respect nature, farm surroundings, and other visitors while staying at the property.</li>
                <li>Management reserves the right to refuse entry or cancel the stay without refund in case of misconduct, illegal activities, or violation of property policies.</li>
              </ul>
            </section>

            <section className="pt-8 border-t border-gray-100">
              <p className="font-bold text-gray-900">
                Thank you for cooperating and helping us maintain a peaceful and premium experience at Kunnath House.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
