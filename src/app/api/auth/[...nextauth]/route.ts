import NextAuth, { type User, type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { FirestoreAdapter } from '@next-auth/firebase-adapter';
import { getFirestore } from '@/services/firestore';

const authOptions: NextAuthOptions = {
  adapter: FirestoreAdapter(getFirestore()),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'Email' },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Password',
        },
      },
      authorize: async (credentials) => {
        let user: User | null = null;

        if (!credentials || !credentials.email || !credentials.password) {
          return user;
        }

        const firebase = await (
          await import('@/services/firebase')
        ).getFirebase();
        const { getAuth, signInWithEmailAndPassword } = await import(
          'firebase/auth'
        );
        const auth = getAuth(firebase);

        try {
          const { user: signedInUser } = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password,
          );

          user = {
            id: signedInUser.uid,
            email: signedInUser.email,
          };
        } catch (error) {
          console.log(error);
          return user;
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    // jwt: async (token, user, account, profile, isNewUser) => {
    //   if (user) {
    //     token.id = user.id;
    //   }
    //   return token;
    // },
    // async session(session, token) {
    //   session.user.id = token.id;
    //   return session;
    // },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
