import NextAuth from 'next-auth';
import { FirestoreAdapter } from '@next-auth/firebase-adapter';
import { getFirestore } from '@/services/firestore';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  adapter: FirestoreAdapter(getFirestore()),
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const authResponse = await fetch('/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });

        if (!authResponse.ok) {
          return null;
        }

        const user = await authResponse.json();

        return user;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
