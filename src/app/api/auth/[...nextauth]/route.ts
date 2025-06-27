import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/user";
import connectDB from "@/db/mongodb";
import type { NextAuthOptions } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  debug: true, // Enable debug logs
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          console.log('Auth Request:', { 
            email: credentials?.email,
            hasPassword: !!credentials?.password 
          });

          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials');
            throw new Error('Missing credentials');
          }

          await connectDB();

          let user = await User.findOne({ 
            email: credentials.email.toLowerCase() 
          });

          if (!user) {
            // If we have registration data, create the user
            if (credentials.isRegistering) {
              const { firstName, lastName, phoneNumber, address, monthlyIncome } = credentials;
              
              // Hash password for new user
              const salt = await bcrypt.genSalt(10);
              const hashedPassword = await bcrypt.hash(credentials.password, salt);

              // Create new user
              user = await User.create({
                email: credentials.email.toLowerCase(),
                password: hashedPassword,
                firstName,
                lastName,
                phoneNumber,
                address,
                monthlyIncome: parseFloat(monthlyIncome),
                createdAt: new Date(),
                lastUpdated: new Date()
              });

              console.log('Created new user during auth');
            } else {
              console.log('User not found and not registering');
              throw new Error('Invalid credentials');
            }
          }

          // Verify password
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            console.log('Password mismatch');
            throw new Error('Invalid credentials');
          }

          console.log('Auth successful');
          return {
            id: user._id.toString(),
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
          };

        } catch (error) {
          console.error('Auth error:', error);
          throw error; // Let NextAuth handle the error
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log('Sign in attempt:', { 
        success: !!user,
        userId: user?.id,
        provider: account?.provider 
      });
      return !!user;
    },
    async jwt({ token, user }) {
      if (user) {
        console.log('JWT callback - user present:', user);
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback:', { session, token });
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };