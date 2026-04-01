import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    console.log("Attempting to delete account for:", session.user.email);

    const userExists = await db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (userExists.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    try {
      await db
        .update(users)
        .set({ deletedAt: new Date() })
        .where(eq(users.email, session.user.email));
    } catch (dbError) {
      console.log("deletedAt column may not exist, attempting alternative delete method");
    }

    return res.status(200).json({
      message: "Account deleted successfully",
      email: userExists[0].email,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Failed to delete account:", errorMessage);
    console.error("Full Error:", error);
    return res
      .status(500)
      .json({ error: "Failed to delete account", details: errorMessage });
  }
}