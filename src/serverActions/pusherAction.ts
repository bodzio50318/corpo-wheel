"use server"

import { User } from "~/db/schema";
import { getPusherInstance } from "~/libs/sever";


export interface WinnerSelectedPusherMessage {
    winnerId: number;
    messageCreator: User;
}
const pusherServer = getPusherInstance();

export async function sendWinnderSelectedMsg(winnerId: number, messageCreator: User, teamId: number) {
    const NEW_WINER_TOPIC = "new-winner-";
    const message: WinnerSelectedPusherMessage = {
        winnerId: winnerId,
        messageCreator: messageCreator
    };
    await pusherServer.trigger(
        NEW_WINER_TOPIC + teamId,
        "evt::test",
        message
    )

}