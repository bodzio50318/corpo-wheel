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

const NEW_WINER_TOPIC = "new-winner-";

interface WheelOfFortuneProps {
    teamId: number;
    users: User[];
    myUser: User;
}

const COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F06292', '#AED581', '#7986CB',
    '#FFD700', '#FF4500', '#8A2BE2', '#00CED1',
    '#FF1493', '#7FFF00', '#DC143C', '#00FA9A',
    '#FF6347', '#4682B4'
];

export default function WheelOfFortune({ teamId, users, myUser }: WheelOfFortuneProps) {
    const router = useRouter();
    const [rotation, setRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [winner, setWinner] = useState<User | null>(null);
    const wheelRef = useRef<SVGGElement>(null);
    const requestRef = useRef<number | null>(null);

    const chanelName = NEW_WINER_TOPIC + teamId

    const totalChance = users.reduce((sum, item) => sum + item.chance, 0);

    const firstItemAngle = 88 + (users[0]!.chance / totalChance) * 360 / 2;

    //Handle click on spin button
    const clickSpinnButton = async () => {
        if (isSpinning || users.length < 2) return;

        setWinner(null)
        const newWinner = await generateWinner(teamId, myUser);
        setWinner(newWinner);
    };

    //Triger on winner change
    useEffect(() => {
        if (!winner) return;

        const spinDuration = 2000;
        const spinRevolutions = 2;
        const startRotation = 0;

        const sliceAngle = (winner.chance / totalChance) * 360;
        const startAngle = users.slice(0, users.indexOf(winner)).reduce((sum, i) => sum + (i.chance / totalChance) * 360, 0);
        const midAngle = startAngle + sliceAngle / 2;

        const extraSpinAngle = 360 - midAngle;
        const totalSpinAngle = spinRevolutions * 360 + extraSpinAngle;

        const finalRotation = totalSpinAngle;

        const startTime = performance.now();
        const animate = (time: number) => {
            setIsSpinning(true);
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / spinDuration, 1);
            const easeProgress = easeOutCubic(progress);
            const currentRotation = startRotation + easeProgress * finalRotation;

            setRotation(currentRotation % 360);

            if (progress < 1) {
                requestRef.current = requestAnimationFrame(animate);
            } else {
                setIsSpinning(false);
            }
        };

        requestRef.current = requestAnimationFrame(animate);

    }, [winner]);

    useEffect(() => {
        const channel = pusherClient
            .subscribe(chanelName)
            .bind("evt::test", (data: WinnerSelectedPusherMessage) => {
                console.log("Got pusher event", data)
                if (data.messageCreator.id != myUser.id) {
                    toast(`Spin started by ${data.messageCreator.name}`)
                    const winnerId = data.winnerId
                    const winner = users.find(item => item.id === winnerId);
                    setWinner(winner!);
                }
            });

        return () => {
            channel.unbind();
        };
    },);

    const newUserJoinedTopic = `new-user-joined-team-${teamId}`;

    const [localUsers, setLocalUsers] = useState(users);

    useEffect(() => {
        const sendMessage = async () => {
            await sendNewUserJoinedMsg(teamId, myUser);
        };
        sendMessage();
    }, []);

    useEffect(() => {
        const channel = pusherClient
            .subscribe(newUserJoinedTopic)
            .bind("evt::test", (data: NewUserJoinedPusherMessage) => {
                console.log("Got new user joined event", data)
                if (data.user.id !== myUser.id) {
                    toast(`New user joined: ${data.user.name}`);
                    router.refresh();
                }                       
            });

        return () => {
            pusherClient.unsubscribe(newUserJoinedTopic);
        };
    }, [newUserJoinedTopic, myUser.id]);

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

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Wheel of Corpo</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                <div className="relative w-72 h-72 mb-4">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <g ref={wheelRef} transform={`rotate(${rotation - firstItemAngle} 50 50)`}>
                            {users.map((item, index) => {
                                const sliceAngle = users.length === 1 ? 360 : (item.chance / totalChance) * 360;
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
                <Button onClick={clickSpinnButton} disabled={isSpinning}>
                    {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
                </Button>
                {winner && (
                    <p className="mt-4 text-lg font-semibold text-center">
                        Winner: {winner.name}!
                    </p>
                )}
            </CardContent>
        </Card>
    );
}