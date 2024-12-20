"use server"
import { and, eq } from 'drizzle-orm';
import { db } from "..";
import { type User, user } from "../schema";

export async function getAllUsersByTeamId(teamId: number): Promise<User[] | undefined> {
    const users = await db.select().from(user).where(eq(user.teamId, teamId));
    return users;
}

export async function addUser(teamId: number, userName: string,chance:number,color:string): Promise<User> {
    const result = await db.insert(user).values({ teamId: teamId,chance:chance, name: userName,color:color }).returning();
    if (result[0] == null) {
        throw new Error("Error while adding user to team")
    }
    return result[0];
}

export async function getUserByNameAndTeamId(userName: string, teamId: number): Promise<User | undefined> {
    const result = await db.select().from(user).where(and(eq(user.name, userName), eq(user.teamId, teamId)));
    return result[0];
}

export async function getUserByIdAndTeamId(userId: number, teamId: number): Promise<User | undefined> {
    const result = await db.select().from(user).where(and(eq(user.id, userId), eq(user.teamId, teamId)));
    return result[0];
}

export async function getUserById(userId: number): Promise<User | undefined> {
    const result = await db.select().from(user).where(eq(user.id, userId));
    return result[0];
}

export async function updateUserName(userId: number, newName: string): Promise<User> {
    const result = await db.update(user).set({ name: newName }).where(eq(user.id, userId)).returning();
    if (result[0] == null) {
        throw new Error("Error while updating user name")
    }
    return result[0];
}

export async function deleteUser(userId: number): Promise<void> {
    await db.delete(user).where(eq(user.id, userId));
}

export async function updateUserVote(userId: number, vote: boolean): Promise<void> {
    await db.update(user).set({ hasVoted: vote }).where(eq(user.id, userId));
}

export async function updateUserChance(userId: number,chance:number): Promise<void> {
    await db.update(user).set({ chance: chance }).where(eq(user.id, userId));
}

export async function updateUser(userId: number, updates: Partial<User>): Promise<User> {
    const result = await db.update(user)
        .set(updates)
        .where(eq(user.id, userId))
        .returning();
    
    if (result[0] == null) {
        throw new Error("Error while updating user")
    }
    return result[0];
}


