import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "~/server/db";
import { SignInSchema } from "~/schemas/SignInSchema";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        identifier: {
          label: "Username",
          type: "text",
          placeholder: "jsmith | jsmith@xyz.com",
        },
        password: { label: "Password", type: "password"},
      },
      async authorize(credentials, req): Promise<any> {
        // Add logic here to look up the user from the credentials supplied
        if (!credentials) {
          throw new Error("credentials not found");
        }

        const {identifier,password} =  await SignInSchema.parseAsync(credentials);



        // const { identifier, password } = credentials as {
        //   identifier: string;
        //   password: string;
        // };

        const user = await db.user.findUnique({
          where: {
            email: identifier,
          },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
          },
        });

        if (!user) {
          throw new Error("user not found");
        }

       
        const passwordMatch = await bcrypt.compare(password, String(user.password));

        if (!passwordMatch) {
          throw new Error("incorrect password");
        }

        return user;
      },
    }),
  ],
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    jwt: async function jwtCallback({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session: async function sessionCallback({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
} satisfies NextAuthConfig;
