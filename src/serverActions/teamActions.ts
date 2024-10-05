"use server"

import { createTeam, selectTeamByName } from "~/db/dataAcces/teamCrud";

export async function createRoomAction(param: FormData) {
    const teamName = param.get("teamName") as string;
    const password = param.get("password");

    console.log(`Trying to acces a team named: ${teamName}`)
    
    const team = await selectTeamByName(teamName) 
    
    console.log(`Team id: ${team?.id}`)

    //createTeam(teamName)
    
}