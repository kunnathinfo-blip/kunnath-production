export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount).replace('₹', '₹ ');
};

export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export function getOptimizedImageUrl(url: string, width?: number) {
  if (!url) return '';
  if (url.includes('res.cloudinary.com')) {
    if (!url.includes('/f_auto')) {
      const transform = width ? `f_auto,q_auto,w_${width}` : 'f_auto,q_auto';
      return url.replace('/image/upload/', `/image/upload/${transform}/`);
    }
  }
  return url;
}

export function normalizeStayImages(stay: any) {
  if (!stay) return stay;
  
  // Convert mongoose doc to plain object if necessary
  const stayObj = typeof stay.toObject === 'function' ? stay.toObject() : stay;

  const featured = stayObj.featuredImages && stayObj.featuredImages.length > 0
    ? stayObj.featuredImages
    : (stayObj.images?.slice(0, 5) || []);

  const gallery = stayObj.gallery || {};
  const categorized = {
    rooms: stayObj.categorizedImages?.rooms && stayObj.categorizedImages.rooms.length > 0
      ? stayObj.categorizedImages.rooms
      : [
          ...(gallery.bedroom || []),
          ...(gallery.living || []),
          ...(gallery.kitchen || []),
          ...(gallery.bathroom || [])
        ],
    amenities: stayObj.categorizedImages?.amenities && stayObj.categorizedImages.amenities.length > 0
      ? stayObj.categorizedImages.amenities
      : (gallery.amenities || []),
    dining: stayObj.categorizedImages?.dining || [],
    activities: stayObj.categorizedImages?.activities || [],
    exterior: stayObj.categorizedImages?.exterior && stayObj.categorizedImages.exterior.length > 0
      ? stayObj.categorizedImages.exterior
      : (gallery.exterior || []),
    interior: stayObj.categorizedImages?.interior || []
  };

  const other = stayObj.otherImages && stayObj.otherImages.length > 0
    ? stayObj.otherImages
    : (stayObj.images?.slice(5) || []);

  return {
    ...stayObj,
    featuredImages: featured,
    categorizedImages: categorized,
    otherImages: other
  };
}

export function parseUTCDate(val: any): Date {
  if (!val) return new Date();
  if (val instanceof Date) {
    return new Date(Date.UTC(val.getUTCFullYear(), val.getUTCMonth(), val.getUTCDate()));
  }
  const str = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return new Date(str + 'T00:00:00.000Z');
  }
  const d = new Date(str);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

