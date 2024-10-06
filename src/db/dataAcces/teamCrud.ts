
import { db } from "..";
import { Team, team } from "../schema";
import { eq } from 'drizzle-orm';

export async function selectTeamByName(teamName: string): Promise<Team | undefined> {
    const result = await db.select().from(team).where(eq(team.name, teamName));
    return result[0];
}

export async function createTeam(teamName: string): Promise<Team> {
    console.log(`creating team: ${teamName}`)
    const result = await db.insert(team).values({ name: teamName }).returning()
    const newTeam = result[0]
    if (newTeam == null) {
        throw new Error("Error while creating team")
    }
    return newTeam;
}