import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        async signIn({ user }) {
            if (!user.email) return false;

            try {
                const existingUser = await db.query.users.findFirst({
                    where: eq(users.email, user.email),
                });

                // Create user if doesn't exist
                if (!existingUser) {
                    const userId = `user_${Date.now()}`;

                    await db.insert(users).values({
                        id: userId,
                        email: user.email,
                        name: user.name || undefined,
                        image: user.image || undefined,
                    });
                }

                return true;
            } catch (error) {
                console.error("Failed to create user record:", error);
                return true;
            }
        },
        async session({ session }) {
            // Always fetch latest user data from DB
            if (!session?.user?.email) return session;
            try {
                const userRecord = await db.query.users.findFirst({
                    where: eq(users.email, session.user.email),
                });
                if (userRecord) {
                    session.user.name = userRecord.name;
                    session.user.image = userRecord.image;
                }
            } catch (e) {
                // fallback: do nothing
            }
            return session;
        },
    },
}

export default NextAuth(authOptions)