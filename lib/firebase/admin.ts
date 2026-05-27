import admin from 'firebase-admin';

let serviceAccount: any = null;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (error: any) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable:', error.message);
  }
}

if (serviceAccount) {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
} else {
  console.error('Firebase Admin SDK was not initialized: No service account credentials found in process.env.FIREBASE_SERVICE_ACCOUNT.');
}

export default admin;
