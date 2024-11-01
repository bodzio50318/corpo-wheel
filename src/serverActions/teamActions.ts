"use server"

import { redirect } from 'next/navigation';
import { createTeam, selectTeamByName } from "~/db/dataAcces/teamCrud";
<<<<<<< HEAD
import { addUserToTeam, getAllUsersByTeamId, getUserByIdAndTeamId, updateUserChance } from "~/db/dataAcces/userCrud";
import { login } from './authActions';
import { Team, user, User } from '~/db/schema';
import { revalidatePath } from 'next/cache';
=======
import { addUserToTeam, getUserByIdAndTeamId } from "~/db/dataAcces/userCrud";
import { login } from './authActions';
>>>>>>> main

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

<<<<<<< HEAD
// Define the return type for the action
type LoginState = {
    error: string | null;
};

export async function loginAction(
    prevState: LoginState,
    formData: FormData
): Promise<LoginState> {
    const teamName = formData.get("loginTeamName") as string;
    const username = formData.get("loginUserName") as string;
    const password = formData.get("loginPassword") as string;
=======
export async function loginAction(param: FormData) {
    const teamName = param.get("loginTeamName") as string;
    const username = param.get("loginUserName") as string;
    const password = param.get("loginPassword") as string;
>>>>>>> main

    console.log(`Trying to login to team: ${teamName}`);
    const team = await selectTeamByName(teamName);
    if (team == null) {
<<<<<<< HEAD
      return { error: "Invalid password or team name" };
    }
    const user = await getUserByIdAndTeamId(username, team.id);
    if (user == null) {
        return { error: "Invalid password or team name" };
    }

    try {
        await login(team.id, password);
    } catch (error) {
        return { 
            error: error instanceof Error ? error.message : 'An error occurred' 
        };
    }
    redirect(`/team/${team.id}/user/${user.id}`);
}

export async function acceptResult(winner:User,teamId:number){
    const users =await  getAllUsersByTeamId(teamId)

    if(!users){
        throw new Error("Users not found!")
    }
    const otherUsers = users.filter(user => user.id !== winner.id);

    const totalChance = otherUsers?.reduce((sum,user)=> sum+user.chance,0)

    await  updateUserChance(winner.id,3)

    const remainingChance = 357

    for (const user of otherUsers) {
        const normalizedChance = Math.round((user.chance / totalChance) * remainingChance);
        await updateUserChance(user.id, normalizedChance);
    }

    //rerender the page
    revalidatePath(`/team/${teamId}`)
}



=======
        throw new Error("Team not found");
    }
    const user = await getUserByIdAndTeamId(username, team.id);
    if (user == null) {
        throw new Error("User not found");
    }
    
    await login(team.id, password);
    redirect(`/team/${team.id}/user/${user.id}`);
}

>>>>>>> main
