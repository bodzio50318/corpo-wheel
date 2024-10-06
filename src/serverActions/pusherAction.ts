"use server"

import { getPusherInstance } from "~/libs/sever";


export interface WinnerSelectedPusherMessage {
    winnerId: number;
}
const pusherServer = getPusherInstance();

export async function sendWinnderSelectedMsg(winnerId: number, teamId: number) {
    const NEW_WINER_TOPIC = "new-winner-";
    const message: WinnerSelectedPusherMessage = {
        winnerId: winnerId,
    };
    await pusherServer.trigger(
        NEW_WINER_TOPIC + teamId,
        "evt::test",
        message
    )

}