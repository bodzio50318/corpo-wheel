"use server"

import { redirect } from 'next/navigation';
import { createTeam, selectTeamByName } from "~/db/dataAcces/teamCrud";
import { addUserToTeam, getUserByIdAndTeamId } from "~/db/dataAcces/userCrud";

export async function createRoomAction(param: FormData) {
    const teamName = param.get("teamName") as string;
    const username = param.get("userName") as string;
    //const password = param.get("password");

    console.log(`Trying to acces a team named: ${teamName}`)

    let team = await selectTeamByName(teamName)
    let userId: number;

    if (team?.id == null) {
        console.log(`Team not found, creating a new team: ${teamName}`);
        team = await createTeam(teamName);
        console.log(`New team id: ${team.id}`);
        userId = (await addUserToTeam(team.id, username)).id;
        redirect(`/team/${team.id}/user/${userId}`);
    }

    console.log(`Team id: ${team.id}`);
    const existingUser = await getUserByIdAndTeamId(username, team.id);
    if (existingUser) {
        console.log(`User already exists, redirecting to user page: ${existingUser.id}`);
        redirect(`/team/${team.id}/user/${existingUser.id}`);
    }
    console.log(`User does not exist, creating a new user: ${username}`);
    userId = (await addUserToTeam(team.id, username)).id;
    redirect(`/team/${team.id}/user/${userId}`);
}

