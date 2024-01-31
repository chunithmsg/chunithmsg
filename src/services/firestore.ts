import { initFirestore } from '@next-auth/firebase-adapter';
import { cert } from 'firebase-admin/app';

export const getFirestore = () => {
  const firestore = initFirestore({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
  });

  if (global.firestore) {
    return global.firestore;
  }

  if (!firestore) {
    return Error('Firestore not found');
  }

  global.firestore = firestore;

  return global.firestore ? global.firestore : firestore;
};
