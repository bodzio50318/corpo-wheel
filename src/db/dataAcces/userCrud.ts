"use server"
import { eq } from 'drizzle-orm';
import { db } from "..";
import { user } from "../schema";

export async function getAllUsersByTeamId(teamId: number) {
    const users = await db.select().from(user).where(eq(user.teamId, teamId));
    return users;
}

export async function addUserToTeam(teamId: number, userName: string) {
    const result = await db.insert(user).values({ teamId: teamId, name: userName }).returning();
    return result[0];
}