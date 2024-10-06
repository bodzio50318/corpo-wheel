"use server"

import { getPusherInstance } from "~/libs/sever";


export interface WinnerSelectedPusherMessage {
    winnerId: number;
    myUserId: number;
}
const pusherServer = getPusherInstance();

export async function sendWinnderSelectedMsg(winnerId: number, myUserId: number, teamId: number) {
    const NEW_WINER_TOPIC = "new-winner-";
    const message: WinnerSelectedPusherMessage = {
        winnerId: winnerId,
        myUserId: myUserId
    };
    await pusherServer.trigger(
        NEW_WINER_TOPIC + teamId,
        "evt::test",
        message
    )

}