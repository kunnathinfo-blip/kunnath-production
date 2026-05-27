import Razorpay from 'razorpay';

export const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error('Razorpay keys are missing from environment variables');
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
};
