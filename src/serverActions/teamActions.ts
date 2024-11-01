"use server"

import { redirect } from 'next/navigation';
import { createTeam, selectTeamByName } from "~/db/dataAcces/teamCrud";
import { addUserToTeam, getUserByIdAndTeamId } from "~/db/dataAcces/userCrud";
import { login } from './authActions';

export async function createRoomAction(param: FormData) {
    const teamName = param.get("teamName") as string;
    const username = param.get("userName") as string;
    const password = param.get("password") as string;

    
    console.log(`Creating a new team: ${teamName}`);
    const team = await createTeam(teamName, password);
    console.log(`New team id: ${team.id}`);
    const userId = (await addUserToTeam(team.id, username)).id;

    await login(team.id, password);
    redirect(`/team/${team.id}/user/${userId}`);
}

export async function loginAction(param: FormData) {
    const teamName = param.get("loginTeamName") as string;
    const username = param.get("loginUserName") as string;
    const password = param.get("loginPassword") as string;

    console.log(`Trying to login to team: ${teamName}`);
    const team = await selectTeamByName(teamName);
    if (team == null) {
        throw new Error("Team not found");
    }
    const user = await getUserByIdAndTeamId(username, team.id);
    if (user == null) {
        throw new Error("User not found");
    }
    
    await login(team.id, password);
    redirect(`/team/${team.id}/user/${user.id}`);
}

