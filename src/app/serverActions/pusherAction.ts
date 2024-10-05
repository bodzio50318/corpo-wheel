"use server"

import { getPusherInstance } from "~/libs/sever";

export interface PusherMessage {
    message: string;
    user: string;
    // Add other properties as needed
}
const pusherServer = getPusherInstance();

export async function sendPusherMessage() {
    const message: PusherMessage = {
        message: "test",
        user: "ree",
    };
    await pusherServer.trigger(
        'private-chat',
        "evt::test",
        message
    )

}