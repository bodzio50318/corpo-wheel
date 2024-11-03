"use client"

import { CreateTeamCard } from './CreateTeamCard'
import { LoginCard } from './LoginCard'

export default function WelcomeScreen() {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 p-4">
        <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6">
        <LoginCard />
        <CreateTeamCard />
        </div>
      </div>
    )
  }