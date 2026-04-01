import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { name } = req.body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({ error: "Invalid name provided" });
  }

  if (name.length > 100) {
    return res.status(400).json({ error: "Name is too long (max 100 characters)" });
  }

  try {
    console.log("Attempting to update user with email:", session.user.email);
    console.log("New name:", name.trim());

    const result = await db
      .update(users)
      .set({ name: name.trim() })
      .where(eq(users.email, session.user.email));

    console.log("Update completed");

    // Fetch the updated user instead of relying on .returning()
    const updatedUser = await db
      .select({ id: users.id, name: users.name, email: users.email })
      .from(users)
      .where(eq(users.email, session.user.email));

    if (updatedUser.length === 0) {
      console.log("User not found for email:", session.user.email);
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "Display name updated successfully",
      user: {
        name: updatedUser[0].name,
        email: updatedUser[0].email,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Failed to update user name:", errorMessage);
    console.error("Full error:", error);
    return res.status(500).json({ error: "Failed to update display name", details: errorMessage });
  }
}