"use server"

import {type User } from "~/db/schema";
import { getPusherInstance } from "~/libs/sever";


const pusherServer = getPusherInstance();

export interface WinnerSelectedPusherMessage {
    winnerId: number;
    messageCreator: User;
}

export interface NewUserJoinedPusherMessage {
    user: User;
}

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

export async function sendNewUserJoinedMsg(teamId: number, user: User) {
    const NEW_USER_JOINED_TOPIC = `new-user-joined-team-${teamId}`;
    const message: NewUserJoinedPusherMessage = {
        user: user
    };
    await pusherServer.trigger(
        NEW_USER_JOINED_TOPIC,
        "evt::test",
        message
    )
}