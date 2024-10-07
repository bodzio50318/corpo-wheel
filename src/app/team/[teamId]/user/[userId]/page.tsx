import { redirect } from 'next/navigation';
import { selectTeamById } from "~/db/dataAcces/teamCrud";
import { getAllUsersByTeamId, getUserById } from "~/db/dataAcces/userCrud";
import WheelOfFortune from "./wheel-of-fortune";
import VotingTable from './voting-table';

export default async function TeamPage({ params }: { params: { teamId: number, userId: number } }) {

    const team = await selectTeamById(params.teamId)
    const user = await getUserById(params.userId)

    if (team == null) {
        redirect(`/`)
    }

    const users = await getAllUsersByTeamId(params.teamId);
    return (
        <main className="flex min-h-screen flex-row items-center justify-center p-24">
            <div className="flex-1 mr-8">
                <VotingTable />
            </div>
            <div className="flex-1">
                <WheelOfFortune teamId={params.teamId} users={users!} myUser={user!} />
            </div>
        </main>
    );
}


