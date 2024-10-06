"use server"

import { createTeam, selectTeamByName } from "~/db/dataAcces/teamCrud";

export async function createRoomAction(param: FormData) {
    const teamName = param.get("teamName") as string;
    const password = param.get("password");

    console.log(`Trying to acces a team named: ${teamName}`)
    
    let team = await selectTeamByName(teamName) 
    
    if (team?.id == null) {
        console.log(`Team not found, creating a new team: ${teamName}`);
        team=await createTeam(teamName);
        console.log(`New team id: ${team.id}`);

    } else {
        console.log(`Team id: ${team.id}`);
    }
}