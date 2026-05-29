import admin from 'firebase-admin';

let serviceAccount: any = null;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    // If it's a file path or a string, try parsing it
    const trimmedEnv = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
    if (trimmedEnv.startsWith('{')) {
      serviceAccount = JSON.parse(trimmedEnv);
    } else {
      // Fallback in case it was written as a file path
      console.warn('FIREBASE_SERVICE_ACCOUNT does not start with JSON object curly brace.');
    }
  } catch (error: any) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable:', error.message);
  }
}

if (serviceAccount) {
  // Normalize private key formatting to fix PEM parser errors (common in environment variable setups)
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }

  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Admin SDK initialized successfully');
    }
  } catch (error: any) {
    console.error('Error initializing Firebase Admin SDK:', error.message || error);
  }
} else {
  console.error('Firebase Admin SDK was not initialized: No service account credentials found in process.env.FIREBASE_SERVICE_ACCOUNT.');
}

export default admin;
