import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

// Edge-safe config (no Prisma/bcrypt) — shared by middleware and the Node auth instance.
export default {
  providers: [Google],
  pages: { signIn: "/login" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isProtected = nextUrl.pathname.startsWith("/dashboard")
      const isAuthPage =
        nextUrl.pathname === "/login" || nextUrl.pathname === "/register"

      if (isProtected) return isLoggedIn
      if (isAuthPage && isLoggedIn)
        return Response.redirect(new URL("/dashboard", nextUrl))
      return true
    },
  },
} satisfies NextAuthConfig
