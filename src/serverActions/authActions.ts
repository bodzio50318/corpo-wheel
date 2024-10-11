"use server"


import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { selectTeamById } from "~/db/dataAcces/teamCrud";


const key = new TextEncoder().encode(process.env.SECRET_KEY);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 sec from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(formData: FormData) {
  // Verify credentials && get the user
  const teamId = Number(formData.get("teamId"))!;
  const password = formData.get("password");

  const encryptedPassword = await encrypt(password);

  const dbTeam = await selectTeamById(teamId);
  if (!dbTeam) {
    throw new Error("Team not found");
  }
  const dbPassword = dbTeam.passwordHash!;

  if (dbPassword !== encryptedPassword) {
    throw new Error("Invalid password");
  }

  // Create the session
  const expires = new Date(Date.now() + 10 * 60 * 1000);
  const session = await encrypt({ teamId, expires });

  // Save the session in a cookie
  cookies().set("session", session, { expires, httpOnly: true });
}

export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 10 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}