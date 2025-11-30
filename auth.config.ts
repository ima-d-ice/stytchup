import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: '/login', // Redirect here if not authenticated
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      }
      return true
    },
  },
  providers: [], // Providers with DB adapters go in auth.ts, not here
} satisfies NextAuthConfig