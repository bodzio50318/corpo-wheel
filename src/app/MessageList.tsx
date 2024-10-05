// src/components/MessageList.tsx
'use client';

import { useEffect, useState } from "react";
import { pusherClient } from "~/libs/client";

export interface PusherMessage {
    message: string;
    user: string;
    // Add other properties as needed
}

export default function MessageList() {

    const [messages, setMessages] = useState<PusherMessage[]>([]);

    useEffect(() => {
        const channel = pusherClient
            .subscribe('private-chat')
            .bind("evt::test", (data: PusherMessage) => {
                console.log("test", data)
                setMessages([...messages, data])
            });

        return () => {
            channel.unbind();
        };
    }, [messages]);

    const handleTestClick = async () => {
        const data = await fetch('/api/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: 'test' })
        })
    }

    return (
        <div className="flex flex-col">
            <button
                className="w-[240px] bg-slate-600 hover:bg-slate-500 rounded p-2 m-2"
                onClick={() => handleTestClick()}>
                Test
            </button>

            <div>
                {messages.map((message: PusherMessage) => (
                    <div
                        key={1}
                        className="border border-slate-600 rounded p-2 m-2"
                    >
                        {message.message}
                        <br />
                    </div>
                ))}
            </div>
        </div>
    );
};