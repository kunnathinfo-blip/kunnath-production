// 'use client';

// import React, { useState } from 'react';
// import { Container } from '@/Components/ui/Container';
// import { Button } from '@/Components/ui/Button';
// import { Card } from '@/Components/ui/Card';
// import { Check, HelpCircle, ChevronDown, ChevronUp, Star, Shield, Zap, Gift } from 'lucide-react';

// export default function MembershipPage() {
//   const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
//   const [openFaq, setOpenFaq] = useState<number | null>(null);

//   const tiers = [
//     {
//       name: 'Basic',
//       price: { monthly: '₹0', yearly: '₹0' },
//       description: 'Experience Kunnath House as a valued guest with zero commitment.',
//       icon: <Zap size={24} className="text-gray-400" />,
//       features: [
//         'Standard booking access',
//         'Access to basic amenities',
//         'Digital newsletter subscription',
//         'Standard customer support'
//       ],
//       highlight: false,
//       cta: 'Get Started'
//     },
//     {
//       name: 'Silver',
//       price: { monthly: '₹5,000', yearly: '₹50,000' },
//       description: 'Perfect for occasional visitors looking for priority access.',
//       icon: <Shield size={24} className="text-blue-500" />,
//       features: [
//         '10% discount on all Farm Stays',
//         'Complimentary breakfast during stays',
//         '5 hours of free sports access monthly',
//         'Priority booking window (7 days)',
//         'Welcome kit on first visit'
//       ],
//       highlight: false,
//       cta: 'Become Silver'
//     },
//     {
//       name: 'Gold',
//       price: { monthly: '₹12,000', yearly: '₹1,20,000' },
//       description: 'Our most popular tier. Designed for regular weekend escapes.',
//       icon: <Star size={24} className="text-yellow-500" />,
//       features: [
//         '25% discount on all Farm Stays',
//         '1 Free weekend stay (2 nights)',
//         'Unlimited free sports access',
//         'Priority booking window (30 days)',
//         'Exclusive access to members-only events',
//         'Dedicated account manager'
//       ],
//       highlight: true,
//       cta: 'Go Gold'
//     },
//     {
//       name: 'Platinum',
//       price: { monthly: '₹30,000', yearly: '₹3,00,000' },
//       description: 'The ultimate Kunnath House experience with unparalleled luxury.',
//       icon: <Gift size={24} className="text-purple-500" />,
//       features: [
//         '50% discount on all Farm Stays',
//         '3 Free weekend stays (2 nights each)',
//         'Dedicated 24/7 concierge service',
//         'Guaranteed availability',
//         'Free airport transfers for guests',
//         'Personalized gifting suite',
//         'Lifetime membership badge'
//       ],
//       highlight: false,
//       cta: 'Reach Platinum'
//     }
//   ];

//   const comparisons = [
//     { feature: 'Stay Discount', basic: 'None', silver: '10%', gold: '25%', platinum: '50%' },
//     { feature: 'Free Stays', basic: '-', silver: '-', gold: '1 Weekend', platinum: '3 Weekends' },
//     { feature: 'Sports Access', basic: 'Paid', silver: '5 hrs/mo', gold: 'Unlimited', platinum: 'Unlimited' },
//     { feature: 'Booking Window', basic: 'Standard', silver: '7 Days Early', gold: '30 Days Early', platinum: 'Guaranteed' },
//     { feature: 'Breakfast', basic: 'Paid', silver: 'Complimentary', gold: 'Complimentary', platinum: 'Personal Chef' },
//     { feature: 'Concierge', basic: '-', silver: '-', gold: 'Yes', platinum: '24/7 Dedicated' },
//     { feature: 'Event Access', basic: '-', silver: '-', gold: 'Exclusive', platinum: 'VIP/Backstage' },
//   ];

//   const faqs = [
//     {
//       question: "How do I upgrade my membership?",
//       answer: "You can upgrade your membership at any time through your dashboard. The remaining balance of your current plan will be prorated towards the new one."
//     },
//     {
//       question: "Can I cancel my annual membership?",
//       answer: "Yes, you can cancel your subscription at any time. If you cancel an annual plan, you will continue to have access until the end of your billing cycle."
//     },
//     {
//       question: "What are the guest policies for members?",
//       answer: "Members can bring up to 4 guests with them under their discounts. Platinum members have expanded guest allowances for up to 10 people."
//     },
//     {
//       question: "Is there a trial period?",
//       answer: "Our 'Basic' plan acts as a permanent free tier where you can experience the booking process and basic community features."
//     }
//   ];

//   return (
//     <div className="bg-white min-h-screen">
//       {/* Hero Section */}
//       <section className="bg-gray-900 text-white py-24 relative overflow-hidden">
//         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2000')] bg-cover bg-center opacity-20"></div>
//         <Container className="relative z-10 text-center">
//           <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">Elevate Your Lifestyle</span>
//           <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
//             Kunnath House Memberships
//           </h1>
//           <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
//             Join an exclusive community of luxury enthusiasts. Enjoy unparalleled access, massive discounts, and priority bookings at our premium farm stays.
//           </p>

//           {/* Billing Toggle */}
//           <div className="flex items-center justify-center space-x-4">
//             <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
//             <button 
//               onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
//               className="relative w-14 h-7 bg-primary rounded-full p-1 transition-all"
//             >
//               <div className={`w-5 h-5 bg-white rounded-full transition-all transform ${billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'}`}></div>
//             </button>
//             <div className="flex items-center space-x-2">
//               <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500'}`}>Yearly</span>
//               <span className="bg-green-500 text-[10px] font-bold px-2 py-0.5 rounded-full text-white uppercase">Save 20%</span>
//             </div>
//           </div>
//         </Container>
//       </section>

//       {/* Pricing Grid */}
//       <section className="py-20 -mt-20">
//         <Container>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {tiers.map((tier, index) => (
//               <Card 
//                 key={index} 
//                 className={`flex flex-col h-full transition-all duration-300 border-0 shadow-xl hover:shadow-2xl hover:-translate-y-2 bg-white ${tier.highlight ? 'ring-2 ring-primary scale-105 z-10' : ''}`}
//               >
//                 {tier.highlight && (
//                   <div className="bg-primary text-white text-center py-2 text-xs font-bold uppercase tracking-widest">
//                     Most Popular
//                   </div>
//                 )}
//                 <div className="p-8 flex-1">
//                   <div className="mb-6 inline-block p-3 bg-gray-50 rounded-2xl">
//                     {tier.icon}
//                   </div>
//                   <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
//                   <p className="text-gray-500 text-sm mb-6 leading-relaxed h-12">{tier.description}</p>

//                   <div className="mb-8">
//                     <span className="text-4xl font-bold text-gray-900">{tier.price[billingCycle]}</span>
//                     <span className="text-gray-500 ml-2 text-sm">/ {billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
//                   </div>

//                   <ul className="space-y-4">
//                     {tier.features.map((feature, idx) => (
//                       <li key={idx} className="flex items-start">
//                         <Check size={18} className="text-primary shrink-0 mr-3 mt-0.5" />
//                         <span className="text-gray-700 text-sm">{feature}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//                 <div className="p-8 pt-0 mt-auto">
//                   <Button 
//                     fullWidth 
//                     variant={tier.highlight ? 'primary' : 'outline'}
//                     className={`rounded-xl py-6 font-bold tracking-wide ${tier.highlight ? 'shadow-lg shadow-primary/30' : 'hover:bg-gray-50'}`}
//                   >
//                     {tier.cta}
//                   </Button>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         </Container>
//       </section>

//       {/* Comparison Table */}
//       <section className="py-24 bg-gray-50">
//         <Container>
//           <div className="text-center mb-16">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">Compare Our Tiers</h2>
//             <p className="text-gray-500">Find the perfect level of access for your lifestyle.</p>
//           </div>

//           <div className="max-w-5xl mx-auto overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100">
//             <table className="w-full text-left">
//               <thead>
//                 <tr className="border-b border-gray-100">
//                   <th className="p-6 text-gray-900 font-bold">Feature</th>
//                   <th className="p-6 text-gray-400 font-bold">Basic</th>
//                   <th className="p-6 text-blue-600 font-bold">Silver</th>
//                   <th className="p-6 text-yellow-600 font-bold">Gold</th>
//                   <th className="p-6 text-purple-600 font-bold">Platinum</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-50">
//                 {comparisons.map((row, idx) => (
//                   <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
//                     <td className="p-6 text-gray-700 font-medium">{row.feature}</td>
//                     <td className="p-6 text-gray-500 text-sm">{row.basic}</td>
//                     <td className="p-6 text-gray-900 font-semibold text-sm">{row.silver}</td>
//                     <td className="p-6 text-gray-900 font-semibold text-sm">{row.gold}</td>
//                     <td className="p-6 text-gray-900 font-bold text-sm">{row.platinum}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Container>
//       </section>

//       {/* FAQ Section */}
//       <section className="py-24">
//         <Container className="max-w-4xl">
//           <div className="text-center mb-16">
//             <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
//               <HelpCircle className="text-primary" size={24} />
//             </div>
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
//             <p className="text-gray-500">Everything you need to know about our membership program.</p>
//           </div>

//           <div className="space-y-4">
//             {faqs.map((faq, idx) => (
//               <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden">
//                 <button 
//                   onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
//                   className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors text-left"
//                 >
//                   <span className="font-bold text-gray-900">{faq.question}</span>
//                   {openFaq === idx ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
//                 </button>
//                 {openFaq === idx && (
//                   <div className="p-6 pt-0 bg-white text-gray-600 leading-relaxed text-sm">
//                     {faq.answer}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </Container>
//       </section>

//       {/* Bottom CTA */}
//       <section className="py-20 bg-primary text-white">
//         <Container className="text-center">
//           <h2 className="text-4xl font-bold mb-6 font-display">Ready for the ultimate escape?</h2>
//           <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
//             Join 500+ premium members who enjoy the best of Kunnath House every single weekend.
//           </p>
//           <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
//             <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-10 rounded-xl font-bold">
//               Join Now
//             </Button>
//             <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 px-10 rounded-xl font-bold">
//               Contact Sales
//             </Button>
//           </div>
//         </Container>
//       </section>
//     </div>
//   );
// }


'use client';

import React from 'react';
import { Container } from '@/Components/ui/Container';
import { Button } from '@/Components/ui/Button';
import { Clock } from 'lucide-react';

export default function MembershipPage() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <Container className="py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
            <Clock className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900 mb-4">
            Coming Soon
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Our membership program is currently being reimagined to bring you an even better experience. Stay tuned for exclusive perks, early access, and VIP treatment.
          </p>
          {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="primary" className="rounded-xl px-8">
              Notify Me
            </Button>
            <Button size="lg" variant="outline" className="rounded-xl px-8">
              Back to Home
            </Button>
          </div> */}
          <p className="text-sm text-gray-400 mt-8">
            Launching soon — we can't wait to welcome you.
          </p>
        </div>
      </Container>
    </div>
  );
}