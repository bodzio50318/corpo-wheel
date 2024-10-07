"use server"

import {type User } from "~/db/schema";
import { getPusherInstance } from "~/libs/sever";

const NEW_WINNER_TOPIC = `new-winner-`;
const NEW_USER_JOINED_TOPIC = `new-user-joined-team-`;

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
        "evt::test",
        message
    )
}

export async function sendNewUserJoinedMsg(teamId: number, user: User) {

    const message: NewUserJoinedPusherMessage = {
        user: user
    };
    await pusherServer.trigger(
        NEW_USER_JOINED_TOPIC + teamId,
        "evt::test",
        message
    )
}