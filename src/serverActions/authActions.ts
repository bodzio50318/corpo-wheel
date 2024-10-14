"use server"


import bcrypt from 'bcrypt';
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { selectTeamById } from "~/db/dataAcces/teamCrud";


const key = new TextEncoder().encode(process.env.SECRET_KEY);


export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setSubject(payload.teamId)
    .setExpirationTime("1h") // Changed from "10 sec from now" to "1h"
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(teamId: number, password: string) {
  // Verify credentials && get the user
  const dbTeam = await selectTeamById(teamId);
  if (dbTeam == null) {
    throw new Error("Team not found");
  }

// Compare the provided password with the stored hash
  if (!password ) {
    throw new Error("Password is missing");
  }

if (!dbTeam.passwordHash ) {
  throw new Error("PasswordHash is missing");
  }

  // Compare the provided password with the stored hash
  const passwordMatch = await bcrypt.compare(password, dbTeam.passwordHash!);

  if (!passwordMatch) {
    throw new Error("Invalid password");
  }

  // Create the session
  const expires = new Date(Date.now() + 60 * 60 * 1000); // Changed to 1 hour
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

  try {
    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session);
    const newExpires = new Date(Date.now() + 60 * 60 * 1000); // Set new expiration to 1 hour from now
    const newPayload = { ...parsed, expires: newExpires };
    const res = NextResponse.next();
    res.cookies.set({
      name: "session",
      value: await encrypt(newPayload),
      httpOnly: true,
      expires: newExpires,
    });
    return res;
  } catch (error) {
    // If decryption fails (e.g., token expired), clear the session
    const res = NextResponse.next();
    res.cookies.set({
      name: "session",
      value: "",
      httpOnly: true,
      expires: new Date(0),
    });
    return res;
  }
}
