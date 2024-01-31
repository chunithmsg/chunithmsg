export const getFirebase = async () => {
  const { initializeApp } = await import('firebase/app');
  Promise.all([import('firebase/auth'), import('firebase/firestore')]);

  const app = initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    messagingSenderId: process.env.FIREBASE_SENDER_ID,
  });

  if (global.firebase) {
    return global.firebase;
  }

  if (!app) {
    return Promise.reject(new Error('Firebase not found'));
  }

  global.firebase = app;

  return global.firebase ? global.firebase : app;
};
