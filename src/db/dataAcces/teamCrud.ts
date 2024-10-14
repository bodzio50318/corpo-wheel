"use server"
import { db } from "..";
import { type Team, team } from "../schema";
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function selectTeamByName(teamName: string): Promise<Team | undefined> {
    const result = await db.select().from(team).where(eq(team.name, teamName));
    return result[0];
}

export async function selectTeamById(teamId: number): Promise<Team | undefined> {
    const result = await db.select().from(team).where(eq(team.id, teamId));
    return result[0];
}

export async function createTeam(teamName: string, password: string): Promise<Team> {
    console.log(`creating team: ${teamName}`)
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.insert(team).values({ name: teamName, passwordHash: hashedPassword }).returning()
    const newTeam = result[0]
    if (newTeam == null) {
        throw new Error("Error while creating team")
    }
    return newTeam;
}