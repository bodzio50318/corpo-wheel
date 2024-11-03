import { getAllUsersByTeamId } from "~/db/dataAcces/userCrud";
import UserSelectionCard from "./TeamLogin";
import { selectTeamById } from "~/db/dataAcces/teamCrud";




export default async function HomePage({ params }: { params: { teamId: number } }) {
    const team = await selectTeamById(params.teamId)

    if(!team){
        throw new Error("Team not found!")
    }
    const users = await getAllUsersByTeamId(params.teamId) 
    
    if(!users){
    throw new Error("Users not found!")
    }

    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
       <UserSelectionCard team={team} users={users} />
      </main>
    );
  }