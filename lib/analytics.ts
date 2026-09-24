// lib/analytics.ts

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Send custom events to Google Analytics (GA4)
 */
export const trackGAEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
};

/**
 * Pre-defined business conversion events
 */
export const AnalyticsEvents = {
  // Booking Funnel
  bookingInitiated: (data: {
    category: 'stay' | 'event' | 'sport';
    title?: string;
    id?: string;
    price?: number;
  }) => {
    trackGAEvent('begin_checkout', {
      item_category: data.category,
      item_name: data.title,
      item_id: data.id,
      value: data.price,
      currency: 'INR',
    });
  },

  bookingSuccess: (data: {
    bookingId?: string;
    category: 'stay' | 'event' | 'sport';
    title?: string;
    amount: number;
    paymentId?: string;
  }) => {
    trackGAEvent('purchase', {
      transaction_id: data.bookingId || data.paymentId,
      value: data.amount,
      currency: 'INR',
      items: [
        {
          item_name: data.title,
          item_category: data.category,
          price: data.amount,
        },
      ],
    });
  },

  paymentFailed: (data: {
    category: 'stay' | 'event' | 'sport';
    amount?: number;
    errorReason?: string;
  }) => {
    trackGAEvent('payment_failed', {
      item_category: data.category,
      value: data.amount,
      currency: 'INR',
      error_reason: data.errorReason,
    });
  },

  // Stay / Villa View
  stayViewed: (stay: { id?: string; title?: string; price?: number }) => {
    trackGAEvent('view_item', {
      items: [
        {
          item_id: stay.id,
          item_name: stay.title,
          price: stay.price,
          item_category: 'Stay',
        },
      ],
    });
  },

  // Contact / Lead Generation
  contactSubmitted: (subject?: string) => {
    trackGAEvent('generate_lead', {
      lead_type: 'Contact Inquiry',
      subject: subject || 'General',
    });
  },

  membershipInquiry: () => {
    trackGAEvent('generate_lead', {
      lead_type: 'Membership Inquiry',
    });
  },

  // Direct Contact / Chat
  contactClick: (type: 'whatsapp' | 'phone' | 'email') => {
    trackGAEvent('contact_click', {
      contact_method: type,
    });
  },
};
