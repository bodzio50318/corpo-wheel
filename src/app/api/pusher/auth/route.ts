// src/app/api/pusher/auth/route.ts

import { getPusherInstance } from "~/libs/sever";

const pusherServer = getPusherInstance();

export async function POST(req: Request) {
    console.log("authenticating pusher perms...")
    const data = await req.text();
    const [socketId, channelName] = data
        .split("&")
        .map((str) => str.split("=")[1]);

    console.log("socketId: ", socketId)
    console.log("channelName: ", channelName)
    console.log("headers: ", req.headers)
    console.log("data: ", data)

    const authResponse = pusherServer.authorizeChannel(socketId!, channelName!);

    return new Response(JSON.stringify(authResponse));
}