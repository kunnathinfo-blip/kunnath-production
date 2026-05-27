// components/FAQ.tsx
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: "What is the check-in and check-out time at Kunnath House?",
        answer: "Check-in is from 2:00 PM onwards, and check-out is by 11:00 AM. Early check-in or late check-out may be available upon request, subject to availability and an additional fee."
    },
    {
        question: "Can I host private events like weddings or corporate retreats?",
        answer: "Absolutely. Kunnath House specializes in private events — weddings, corporate offsites, birthday parties, and more. Please use the Event Inquiry form on our Events page or contact us directly for custom packages."
    },
    {
        question: "What sports activities are available on the farm?",
        answer: "We offer Box Cricket, Volleyball, ATV rides, and nature trails. Some activities require advance booking. Check the Sports page for pricing and availability."
    },
    {
        question: "Is there a membership program? What are the benefits?",
        answer: "Yes — Silver, Gold, and Premium memberships. Benefits include discounted stays, early access to events, complimentary activities, and exclusive farm experiences. Visit the Membership page for details."
    },
    {
        question: "What is your cancellation policy?",
        answer: "Free cancellation up to 14 days before check-in. Cancellations within 7-14 days incur a 50% charge. Less than 7 days, the full booking amount is non-refundable. Some special events may have different policies."
    },
    {
        question: "Do you allow pets?",
        answer: "We have limited pet-friendly farm stays. Please mention your pet when booking, and we'll confirm availability. Additional cleaning fees may apply."
    },
    {
        question: "Is the property accessible for elderly or differently-abled guests?",
        answer: "Our main farm stay and event spaces are wheelchair accessible. However, some outdoor activity areas may have uneven terrain. Contact us to ensure we meet your specific needs."
    }
];

const FAQItem = ({ item, isOpen, toggle }: { item: FAQItem; isOpen: boolean; toggle: () => void }) => {
    return (
        <div className="border-b border-[#E0E0E0] last:border-0">
            <button
                onClick={toggle}
                className="w-full py-6 flex justify-between items-center text-left group"
                aria-expanded={isOpen}
            >
                <h3 className="text-lg font-semibold text-[#1A1A1A] group-hover:text-primary transition-colors pr-8">
                    {item.question}
                </h3>
                <ChevronDown
                    className={`w-5 h-5 text-[#666666] transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'
                    }`}
            >
                <p className="text-[#666666] leading-relaxed">{item.answer}</p>
            </div>
        </div>
    );
};

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="bg-white py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-8 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-3xl md:text-5xl font-bold text-[#1A1A1A] mb-4 tracking-tight">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-lg text-[#666666] max-w-2xl mx-auto">
                        Everything you need to know about Kunnath House farm stays, activities, events, and membership.
                    </p>
                </div>

                {/* Accordion */}
                <div className="bg-[#FAFAFA] rounded-2xl shadow-soft border border-[#E0E0E0] p-4 md:p-6">
                    {faqData.map((item, index) => (
                        <FAQItem
                            key={index}
                            item={item}
                            isOpen={openIndex === index}
                            toggle={() => toggleItem(index)}
                        />
                    ))}
                </div>

                {/* Still have questions? CTA */}
                <div className="mt-12 text-center">
                    <p className="text-[#666666] mb-4">Still have questions?</p>
                    <a
                        href="/contact"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary hover:bg-primary-hover transition-colors shadow-sm hover:shadow-md"
                    >
                        Contact Us
                    </a>
                </div>
            </div>
        </div>
    );
}