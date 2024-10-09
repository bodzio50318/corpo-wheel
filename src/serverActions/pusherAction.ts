"use server"

import {type User } from "~/db/schema";
import { getPusherInstance } from "~/libs/sever";

 const NEW_WINNER_TOPIC = `new-winner-`;
 const NEW_USER_JOINED_TOPIC = `new-user-joined-team`;

 const NEW_WINNER_EVENT = "evnt::new-winner";
 const NEW_USER_JOINED_EVENT = "evnt::new-user-joined";

const pusherServer = getPusherInstance();

export interface WinnerSelectedPusherMessage {
    winnerId: number;
    messageCreator: User;
}

export interface NewUserJoinedPusherMessage {
    user: User;
}

export async function sendWinnderSelectedMsg(winnerId: number, messageCreator: User, teamId: number) {
    const message: WinnerSelectedPusherMessage = {
        winnerId: winnerId,
        messageCreator: messageCreator
    };
    await pusherServer.trigger(
        NEW_WINNER_TOPIC + teamId,
        NEW_WINNER_EVENT,
        message
    )
}

export async function sendNewUserJoinedMsg(teamId: number, user: User) {

    console.log(NEW_USER_JOINED_TOPIC + teamId)

    const message: NewUserJoinedPusherMessage = {
        user: user
    };
    await pusherServer.trigger(
        NEW_USER_JOINED_TOPIC + teamId,
        NEW_USER_JOINED_EVENT,
        message
    )
}