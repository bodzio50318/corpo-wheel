"use server"

import { createTeam, selectTeamByName } from "~/db/dataAcces/teamCrud";
import { redirect } from 'next/navigation'
import { addUserToTeam } from "~/db/dataAcces/userCrud";

export async function createRoomAction(param: FormData) {
    const teamName = param.get("teamName") as string;
    const username = param.get("userName") as string;
    const password = param.get("password");

    console.log(`Trying to acces a team named: ${teamName}`)

    let team = await selectTeamByName(teamName)

    if (team?.id == null) {
        console.log(`Team not found, creating a new team: ${teamName}`);
        team = await createTeam(teamName);
        console.log(`New team id: ${team.id}`);

    } else {
        console.log(`Team id: ${team.id}`);
    }

    await addUserToTeam(team.id, username);
    redirect(`/team/${team.id}`);
}