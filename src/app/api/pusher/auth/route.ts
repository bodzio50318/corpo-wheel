// src/app/api/pusher/auth/route.ts

import { getPusherInstance } from "~/libs/sever";

const pusherServer = getPusherInstance();

export async function POST(req: Request) {
    console.log("authenticating pusher perms...")
    const data = await req.text();
    let [socketId, channelName] = data
        .split("&")
        .map((str) => str.split("=")[1]);

    // logic to check user permissions
    if (!socketId || !channelName) {
        socketId="12345";
        channelName="private-chat";
    }
    const authResponse = pusherServer.authorizeChannel(socketId, channelName);

    return new Response(JSON.stringify(authResponse));
}