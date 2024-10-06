import WheelOfFortune from "./wheel-of-fortune";
const items = [
    { id: '0', name: 'Item 1', chance: 10 },
    { id: '1', name: 'Item 2', chance: 20 },
    { id: '2', name: 'Item 3', chance: 30 },
    { id: '3', name: 'Item 4', chance: 40 }
]


export default function TeamPage({ params }: { params: { teamId: string } }) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <WheelOfFortune items={items}></WheelOfFortune>
        </main>
    );
}
