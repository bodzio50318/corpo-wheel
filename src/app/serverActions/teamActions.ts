"use server"

export async function createRoomAction(param: FormData) {
    const teamName = param.get("teamName") as string;
    const password = param.get("password");

    console.log(`Trying to acces a team named: ${teamName}`)
}