"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';

interface WheelItem {
  id: string;
  name: string;
  chance: number;
}

interface WheelOfFortuneProps {
  items: WheelItem[];
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
  '#98D8C8', '#F06292', '#AED581', '#7986CB'
];

export default function WheelOfFortune({ items }: WheelOfFortuneProps) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<WheelItem | null>(null);
  const wheelRef = useRef<SVGGElement>(null);
  const requestRef = useRef<number | null>(null);

  const totalChance = items.reduce((sum, item) => sum + item.chance, 0);

  const spin = () => {
    if (isSpinning || items.length === 0) return;

    setIsSpinning(true);
    setWinner(null);

    const spinDuration = 5000; // 5 seconds
    const spinRevolutions = 5; // Number of full rotations
    const extraSpinAngle = Math.random() * 360; // Random extra spin
    const totalSpinAngle = spinRevolutions * 360 + extraSpinAngle;
    const startRotation = rotation;
    const startTime = performance.now();

    const winningIndex = Math.floor(Math.random() * items.length);
    const winningSlice = items[winningIndex];
    const sliceAngle = (winningSlice!.chance / totalChance) * 360;
    const startAngle = items.slice(0, winningIndex).reduce((sum, i) => sum + (i.chance / totalChance) * 360, 0);
    const midAngle = startAngle + sliceAngle / 2;

    const finalRotation = totalSpinAngle + (360 - midAngle); // Adjust to center the winning slice

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      const easeProgress = easeOutCubic(progress);
      const currentRotation = startRotation + easeProgress * finalRotation;

      setRotation(currentRotation % 360);

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setWinner(winningSlice!);
      }
    };

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Wheel of Fortune</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-72 h-72 mb-4">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <g ref={wheelRef} transform={`rotate(${rotation} 50 50)`}>
              {items.map((item, index) => {
                const sliceAngle = (item.chance / totalChance) * 360;
                const startAngle = items.slice(0, index).reduce((sum, i) => sum + (i.chance / totalChance) * 360, 0);
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
        <Button onClick={spin} disabled={isSpinning}>
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