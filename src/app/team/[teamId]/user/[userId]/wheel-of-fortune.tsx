"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import type { User } from '~/db/schema';
import { pusherClient } from '~/libs/client';
import { NewUserJoinedPusherMessage, sendNewUserJoinedMsg, type WinnerSelectedPusherMessage } from '~/serverActions/pusherAction';
import { generateWinner } from '~/serverActions/wheelActions';
import { LonelyLoserBanner } from './lonelny-banner';
import { TeamPageProps } from './page';


export const NEW_WINNER_TOPIC = `new-winner-`;
export const NEW_USER_JOINED_TOPIC = `new-user-joined-team`;

export const NEW_WINNER_EVENT = "evnt::new-winner";
export const NEW_USER_JOINED_EVENT = "evnt::new-user-joined";


const COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F06292', '#AED581', '#7986CB',
    '#FFD700', '#FF4500', '#8A2BE2', '#00CED1',
    '#FF1493', '#7FFF00', '#DC143C', '#00FA9A',
    '#FF6347', '#4682B4'
];

export default function WheelOfFortune({ teamId, users, myUser }: TeamPageProps) {
    const router = useRouter();
    const [rotation, setRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [winner, setWinner] = useState<User | null>(null);
    const wheelRef = useRef<SVGGElement>(null);
    const requestRef = useRef<number | null>(null);

    const totalChance = users.reduce((sum, item) => sum + item.chance, 0);

    

    useEffect(() => {
        // Subscribe to Pusher channels
        const newWinnerChannel = pusherClient.subscribe(NEW_WINNER_TOPIC+teamId);
        const newUserJoinedChannel = pusherClient.subscribe(NEW_USER_JOINED_TOPIC+teamId);


        const sendMessage = async () => {
            try {
                await sendNewUserJoinedMsg(teamId, myUser);
            } catch (error) {
                console.error("Failed to send new user joined message:", error);
                toast.error("Failed to notify others about joining");
            }
        };
    
        // Use void operator to explicitly ignore the promise
        void sendMessage();
        
        // Handle new winner event
        newWinnerChannel.bind(NEW_WINNER_EVENT, (data: WinnerSelectedPusherMessage) => {
            console.log("Got pusher event", data);
            if (data.messageCreator.id !== myUser.id) {
                toast(`Spin started by ${data.messageCreator.name}`);
                const winnerId = data.winnerId;
                const winner = users.find(item => item.id === winnerId);
                if (winner) {
                    setWinner(winner);
                    setIsSpinning(true);
                }
            }
        });

        // Handle new user joined event
        newUserJoinedChannel.bind(NEW_USER_JOINED_EVENT, (data: NewUserJoinedPusherMessage) => {
            console.log("Got new user joined event", data);
            if (data.user.id !== myUser.id) {
                toast(`New user joined: ${data.user.name}`);
                // Optionally refresh the page or update the users list
                router.refresh();
            }
        });

        // Cleanup function
        return () => {
            pusherClient.unsubscribe(NEW_WINNER_TOPIC);
            pusherClient.unsubscribe(NEW_USER_JOINED_TOPIC);
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    //Trigger on winner change
    useEffect(() => {
        if (!winner || !isSpinning) return;

        const spinDuration = 5000; // 5 seconds spin
        const spinRevolutions = 5; // Number of full rotations before stopping

        // Calculate the winner's slice
        const winnerIndex = users.findIndex(user => user.id === winner.id);
        const sliceAngle = (winner.chance / totalChance) * 360;
        const startAngle = users.slice(0, winnerIndex).reduce((sum, user) => sum + (user.chance / totalChance) * 360, 0);
        const midAngle = startAngle + sliceAngle / 2;

        // Calculate the final rotation to stop at the winner
        const stopAngle = (360 - midAngle + 270) % 360; // 270 degrees offset to align with the top pointer
        const totalRotation = spinRevolutions * 360 + stopAngle;

        const startTime = performance.now();
        const animate = (time: number) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / spinDuration, 1);
            const easeProgress = easeOutCubic(progress);
            const currentRotation = easeProgress * totalRotation;

            setRotation(currentRotation % 360);

            if (progress < 1) {
                requestRef.current = requestAnimationFrame(animate);
            } else {
                setIsSpinning(false);
                setRotation(stopAngle);
            }
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [winner, users, totalChance, isSpinning]);

    const easeOutCubic = (t: number): number => {
        return 1 - Math.pow(1 - t, 3);
    };

    useEffect(() => {
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, []);

    const clickSpinButton = async () => {
        if (isSpinning) return;
        
        setIsSpinning(true);
        setWinner(null); // Reset winner before new spin
        try {
            const result = await generateWinner(teamId, myUser);
            if (result) {
                const winnerUser = users.find(user => user.id === result.id);
                if (winnerUser) {
                    setWinner(winnerUser);
                } else {
                    throw new Error("Winner not found in users list");
                }
            } else {
                throw new Error("No winner returned");
            }
        } catch (error) {
            console.error("Error generating winner:", error);
            toast.error("Failed to generate winner. Please try again.");
            setIsSpinning(false);
        }
    };

    return (
        <>
        {users.length === 1 && <LonelyLoserBanner />}
        {users.length > 1 && (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Wheel of Corpo</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                <div className="relative w-72 h-72 mb-4">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <g ref={wheelRef} transform={`rotate(${rotation} 50 50)`}>
                            {users.map((item, index) => {
                                const sliceAngle = (item.chance / totalChance) * 360;
                                const startAngle = users.slice(0, index).reduce((sum, i) => sum + (i.chance / totalChance) * 360, 0);
                                const midAngle = startAngle + sliceAngle / 2;
                                const endAngle = startAngle + sliceAngle;
                                const largeArcFlag = sliceAngle > 180 ? 1 : 0;

                                const startX = 50 + 50 * Math.cos((startAngle * Math.PI) / 180);
                                const startY = 50 + 50 * Math.sin((startAngle * Math.PI) / 180);
                                const endX = 50 + 50 * Math.cos((endAngle * Math.PI) / 180);
                                const endY = 50 + 50 * Math.sin((endAngle * Math.PI) / 180);

                                const pathData = [
                                    `M 50 50`,
                                    `L ${startX} ${startY}`,
                                    `A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                                    `Z`
                                ].join(' ');

                                const textX = 50 + 35 * Math.cos((midAngle * Math.PI) / 180);
                                const textY = 50 + 35 * Math.sin((midAngle * Math.PI) / 180);

                                return (
                                    <g key={item.id}>
                                        <path d={pathData} fill={COLORS[index % COLORS.length]} stroke="none" />
                                        <text
                                            x={textX}
                                            y={textY}
                                            textAnchor="middle"
                                            fill="white"
                                            fontSize="3"
                                            fontWeight="bold"
                                            transform={`rotate(${midAngle} ${textX} ${textY})`}
                                        >
                                            {item.name}
                                        </text>
                                    </g>
                                );
                            })}
                        </g>
                        <circle cx="50" cy="50" r="50" fill="none" stroke="black" strokeWidth="2" />
                        <circle cx="50" cy="50" r="4" fill="black" />
                        <path d="M 50 0 L 55 10 L 45 10 Z" fill="black" />
                    </svg>
                </div>
                <Button onClick={clickSpinButton} disabled={isSpinning}>
                    {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
                </Button>
                {winner && !isSpinning && (
                    <p className="mt-4 text-lg font-semibold text-center">
                        Winner: {winner.name}!
                    </p>
                )}
            </CardContent>
        </Card>)}
        </>
    );
}