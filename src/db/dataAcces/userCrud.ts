"use server"
import { and, eq } from 'drizzle-orm';
import { db } from "..";
import { type User, user } from "../schema";

export async function getAllUsersByTeamId(teamId: number): Promise<User[] | undefined> {
    const users = await db.select().from(user).where(eq(user.teamId, teamId));
    return users;
}

export async function addUserToTeam(teamId: number, userName: string): Promise<User> {
    const result = await db.insert(user).values({ teamId: teamId, name: userName }).returning();
    if (result[0] == null) {
        throw new Error("Error while adding user to team")
    }
    return result[0];
}

export async function getUserByIdAndTeamId(userName: string, teamId: number): Promise<User | undefined> {
    const result = await db.select().from(user).where(and(eq(user.name, userName), eq(user.teamId, teamId)));
    return result[0];
}