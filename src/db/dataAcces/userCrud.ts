"use server"
import { and, eq } from 'drizzle-orm';
import { db } from "..";
import { type User, user } from "../schema";

export async function getAllUsersByTeamId(teamId: number): Promise<User[] | undefined> {
    const users = await db.select().from(user).where(eq(user.teamId, teamId));
    return users;
}

const COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F06292', '#AED581', '#7986CB',
    '#FFD700', '#FF4500', '#8A2BE2', '#00CED1',
    '#FF1493', '#7FFF00', '#DC143C', '#00FA9A',
    '#FF6347', '#4682B4'
];

export async function addUserToTeam(teamId: number, userName: string): Promise<User> {
    const users = await getAllUsersByTeamId(teamId)
    
    if(!users){
        throw new Error("Users not found!")
    }
    let initialChnace = 0
    if(users.length === 0){
        initialChnace = 360
    }else{
        initialChnace = Math.ceil(users?.reduce((sum,user)=> sum+user.chance,0)/users.length)
    }

    const color = COLORS[users.length%COLORS.length]!

    const result = await db.insert(user).values({ teamId: teamId,chance:initialChnace, name: userName,color:color }).returning();
    if (result[0] == null) {
        throw new Error("Error while adding user to team")
    }
    return result[0];
}

export async function getUserByIdAndTeamId(userName: string, teamId: number): Promise<User | undefined> {
    const result = await db.select().from(user).where(and(eq(user.name, userName), eq(user.teamId, teamId)));
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

export async function updateUserVote(userId: number): Promise<void> {
    await db.update(user).set({ hasVoted: true }).where(eq(user.id, userId));
}

export async function updateUserChance(userId: number,chance:number): Promise<void> {
    await db.update(user).set({ chance: chance }).where(eq(user.id, userId));
}