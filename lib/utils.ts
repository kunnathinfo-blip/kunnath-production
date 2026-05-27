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
