import { cookies } from "next/headers";
import { NextApiRequest, NextApiResponse } from "next";

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import AuthService from "@/api/server/auth";

const authService = new AuthService();

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      menuAccess: string;
      username: string;
      isAdmin?: boolean;
      isSuperAccount?: boolean;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    name: string;
    menuAccess: string;
    username: string;
    isAdmin?: boolean;
    isSuperAccount?: boolean;
    email: string;
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    menuAccess: string;
    username: string;
    isAdmin?: boolean;
    isSuperAccount?: boolean;
    email: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        csrfToken: { label: "token", type: "token" },
      },
      authorize: async (credentials) => {
        if (!credentials?.username) return null;

        const user = await authService.authorize(credentials);

        if (!user || !user?.id) return null;

        const { accessToken, refreshToken, ...rest } = user;

        return { ...rest, accessToken, refreshToken };
      },
    }),
  ],
  pages: {
    signIn: "/sign/login",
    signOut: "/sign/login",
    newUser: "/sign/login",
    error: "/error",
  },
  session: {
    maxAge: 60 * 120,
  },
  jwt: {
    maxAge: 60 * 120,
  },
  callbacks: {
    jwt: ({ token = {}, user = {} }) => Object.assign(token, user),
    // async jwt({ token, user }) {
    //   console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    //   console.log(user)
    //   if (user) {
    //     token.id = user.id;
    //     token.name = user.name;
    //     token.menuAccess = user.menuAccess;
    //     token.username = user.username;
    //     token.isAdmin = user.isAdmin;
    //     token.isSuperAccount = user.isSuperAccount ?? false;
    //   }
    //   console.log("##############################")
    //   console.log(token)
    //   return token;
    // },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          menuAccess: token.menuAccess,
          username: token.username,
          isAdmin: token.isAdmin,
          isSuperAccount: token.isSuperAccount,
          email: token.email,
        };
      }

      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      try {
        if (account?.type === "credentials") {
          const accessToken = (user as any).accessToken;
          const refreshToken = (user as any).refreshToken;

          cookies().set("next-auth.access-token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            // maxAge: 60,
            maxAge: parseInt(
              process.env.NEXT_PUBLIC_REFRESH_EXPIRE_C || "3600",
              10
            ),
            path: "/",
          });

          cookies().set("next-auth.refresh-token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: parseInt(
              process.env.NEXT_PUBLIC_REFRESH_EXPIRE_C || "3600",
              10
            ),
            path: "/",
          });
        }
      } catch (e) {
        console.log(e);
      }

      return true;
    },
    // async redirect({ url, baseUrl }) {
    //   if (url === "/") return `${baseUrl}/viewon/members`;
    //   return `${baseUrl}/viewon/members`;
    // },
  },
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signOut(message) {
      const { username = "", id = "" } = message?.token;
      await authService.signout(id, username);

      cookies().set("next-auth.access-token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: -1, // 쿠키 삭제를 위한 설정
        path: "/",
      });

      cookies().set("next-auth.refresh-token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: -1,
        path: "/",
      });
    },
  },
  debug: true,
};

const handler = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, authOptions);

export { handler as GET, handler as POST };
