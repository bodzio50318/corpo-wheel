
import { db } from "..";
import { team } from "../schema";
import { eq } from 'drizzle-orm';

export async function selectTeamByName(teamName: string) {
    const result =await db.select().from(team).where(eq(team.name, teamName));
    return result[0];
}

export async function createTeam(teamName: string) {
    console.log(`creating team: ${teamName}`)
    const result = await db.insert(team).values({ name: teamName })
    return result;
}