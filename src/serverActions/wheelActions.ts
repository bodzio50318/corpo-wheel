"use server"

import { getAllUsersByTeamId } from "~/db/dataAcces/userCrud";
import { User } from "~/db/schema";
import { sendWinnderSelectedMsg } from "./pusherAction";

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