import { NextResponse } from 'next/server'
import { PusherMessage } from '~/app/MessageList';
import { getPusherInstance } from '~/libs/sever';

const pusherServer = getPusherInstance();

export async function POST(req: Request, res: Response) {
    try {
        const message: PusherMessage = {
            message: "test",
            user: "ree",
        };
        await pusherServer.trigger(
            'private-chat',
            "evt::test",
            message
        )

        return NextResponse.json({ message: "Sockets tested" }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Failed to test sockets", error: error }, { status: 500 })
    }
}