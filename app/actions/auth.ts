"use server"

import { createServiceClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"

const SESSION_COOKIE = "session_user"
const SALT_ROUNDS = 12

const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

function checkRateLimit(identifier: string): { allowed: boolean; remainingTime?: number } {
  const now = Date.now()
  const attempt = loginAttempts.get(identifier)

  if (!attempt) {
    return { allowed: true }
  }

  if (now - attempt.lastAttempt > LOCKOUT_DURATION) {
    loginAttempts.delete(identifier)
    return { allowed: true }
  }

  if (attempt.count >= MAX_ATTEMPTS) {
    const remainingTime = Math.ceil((LOCKOUT_DURATION - (now - attempt.lastAttempt)) / 1000 / 60)
    return { allowed: false, remainingTime }
  }

  return { allowed: true }
}

function recordFailedAttempt(identifier: string): void {
  const now = Date.now()
  const attempt = loginAttempts.get(identifier)

  if (!attempt || now - attempt.lastAttempt > LOCKOUT_DURATION) {
    loginAttempts.set(identifier, { count: 1, lastAttempt: now })
  } else {
    loginAttempts.set(identifier, { count: attempt.count + 1, lastAttempt: now })
  }
}

function clearFailedAttempts(identifier: string): void {
  loginAttempts.delete(identifier)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function loginAction(username: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const rateLimitKey = username.toLowerCase()
    const rateLimit = checkRateLimit(rateLimitKey)

    if (!rateLimit.allowed) {
      return {
        success: false,
        error: `Muitas tentativas. Tente novamente em ${rateLimit.remainingTime} minutos.`,
      }
    }

    const supabase = await createServiceClient()

    const { data: users, error } = await supabase.from("users").select("*").eq("username", username).limit(1)

    if (error) {
      return { success: false, error: "Erro no banco de dados" }
    }

    if (!users || users.length === 0) {
      recordFailedAttempt(rateLimitKey)
      return { success: false, error: "Usuário ou senha inválidos" }
    }

    const user = users[0]

    const isValid = await verifyPassword(password, user.password_hash)

    if (!isValid) {
      recordFailedAttempt(rateLimitKey)
      return { success: false, error: "Usuário ou senha inválidos" }
    }

    clearFailedAttempts(rateLimitKey)

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return { success: true }
  } catch {
    return { success: false, error: "Erro ao fazer login" }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect("/login")
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)
  return session?.value || null
}

export async function verifySession(username: string): Promise<boolean> {
  const supabase = await createServiceClient()
  const { data: users, error } = await supabase
    .from("users")
    .select("username")
    .eq("username", username)
    .limit(1)

  if (error || !users || users.length === 0) {
    return false
  }

  return true
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }

  const isValid = await verifySession(session)
  if (!isValid) {
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE)
    redirect("/login")
  }

  return session
}
