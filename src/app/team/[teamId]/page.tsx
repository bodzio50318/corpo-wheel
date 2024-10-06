import { getAllUsersByTeamId } from "~/db/dataAcces/userCrud";
import WheelOfFortune from "./wheel-of-fortune";

export default async function TeamPage({ params }: { params: { teamId: number } }) {
    const users = await getAllUsersByTeamId(params.teamId);
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <WheelOfFortune teamId={params.teamId} users={users}></WheelOfFortune>
        </main>
    );
}
