export const getFirebase = async () => {
  const { initializeApp } = (await import('firebase/app')).default;

  Promise.all([import('firebase/database'), import('firebase/auth')]);

  const firebase = initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    messagingSenderId: process.env.FIREBASE_SENDER_ID,
  });

  if (global.firebase) {
    return global.firebase;
  }

  if (!firebase) {
    return Promise.reject(new Error('Firebase not found'));
  }

  global.firebase = firebase;

  return global.firebase ? global.firebase : firebase;
};
