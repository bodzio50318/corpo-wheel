"use server"

import { redirect } from 'next/navigation';
import { createTeam, selectTeamByName } from "~/db/dataAcces/teamCrud";
import { addUser, getAllUsersByTeamId, getUserByIdAndTeamId, updateUserChance } from "~/db/dataAcces/userCrud";
import { login } from './authActions';
import { Team, user, User } from '~/db/schema';
import { revalidatePath } from 'next/cache';
import { sendWinnderSelectedMsg } from './pusherAction';

const COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F06292', '#AED581', '#7986CB',
    '#FFD700', '#FF4500', '#8A2BE2', '#00CED1',
    '#FF1493', '#7FFF00', '#DC143C', '#00FA9A',
    '#FF6347', '#4682B4'
];

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

    console.log(`Trying to login to team: ${teamName}`);
    const team = await selectTeamByName(teamName);
    if (team == null) {
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

export async function generateWinner(teamId: number,user:User): Promise<User> {
    const users = await getAllUsersByTeamId(teamId);
    if (!users || users.length < 2) {
        throw new Error("Not enough users to generate winner")
    }
    const totalChance = users.reduce((sum, item) => sum + item.chance, 0);
    
    const randomValue = Math.random() * totalChance;
    let accumulatedChance = 0;
    let winningSlice: User | null = null;

    for (const user of users) {
        accumulatedChance += user.chance;
        if (randomValue < accumulatedChance) {
            winningSlice = user;
            break;
        }
    }
    
    if (!winningSlice){
        throw new Error("Failed selecting winner")
    }

    await sendWinnderSelectedMsg(winningSlice.id, user, teamId)

    return winningSlice
}


export async function addUserToTeam(teamId: number, userName: string) {
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
    revalidatePath(`/team/${teamId}`)
    return await addUser(teamId, userName,initialChnace,color)
}
