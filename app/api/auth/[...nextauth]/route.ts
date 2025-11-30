import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// Define backend URL (fallback to localhost:4000 if env is missing)
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const authOptions: NextAuthOptions = {
  providers: [
    // 1. Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // 2. Credentials Provider (Email/Password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          // Call Express Backend Login
          const res = await fetch(`${BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          // If backend returns user data, authorize is successful
          if (res.ok && data.user && data.token) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
              role: data.user.role,
              accessToken: data.token,
            };
          }
          return null;
        } catch (error) {
          console.error("Authorize Error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // 👇 The JWT callback is called whenever a token is created or updated
    async jwt({ token, user, account, trigger, session }) {
      
      // A. CREDENTIALS LOGIN FLOW
      if (user) {
        token.sub = user.id; // Ensure Subject is the DB ID
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.name = user.name;
      }

      // B. CLIENT-SIDE UPDATES (e.g. When "Switch to Designer" is clicked)
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }

      // C. GOOGLE LOGIN FLOW (The Critical Sync)
      if (account?.provider === "google") {
        try {
          // 1. Call your Backend to Find or Create the Google User in Postgres
          const res = await fetch(`${BACKEND_URL}/auth/google-sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              email: token.email, 
              name: token.name 
            }),
          });
          
          const data = await res.json();
          
          if (res.ok && data.user) {
            // 2. 🚨 CRITICAL: Overwrite the 'sub' (Subject) with the Postgres ID
            // NextAuth default puts the Google ID here. We replace it with the DB ID.
            token.sub = data.user.id; 
            token.id = data.user.id;
            
            token.role = data.user.role;
            token.accessToken = data.token;
            
            // Force the name to match what is in the DB
            token.name = data.user.name; 
          }
        } catch (error) {
          console.error("Google Sync Logic Error:", error);
        }
      }

      return token;
    },

    // 👇 Pass the data from the Token to the Client Session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string; 
        session.user.name = token.name;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Redirects here if unauthenticated
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET, // Must match backend .env if using same secret
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };