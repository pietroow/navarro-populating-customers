"use server"

import { createServiceClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { requireAuth } from "@/app/actions/auth"
import { z } from "zod"

const customerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255, "Nome muito longo"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().max(20).optional().nullable(),
  status: z.enum(["ativo", "inativo"]).default("ativo"),
})

export async function createCustomer(formData: FormData) {
  await requireAuth()

  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || null,
    status: formData.get("status") || "ativo",
  }

  const result = customerSchema.safeParse(rawData)
  if (!result.success) {
    return { error: result.error.errors[0].message }
  }

  const { name, email, phone, status } = result.data

  const supabase = await createServiceClient()

  const { error } = await supabase.from("customers").insert({
    name,
    email,
    phone: phone || null,
    status,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/")
  return { success: true }
}

const idSchema = z.string().uuid("ID inválido")

export async function updateCustomer(id: string, formData: FormData) {
  await requireAuth()

  const idResult = idSchema.safeParse(id)
  if (!idResult.success) {
    return { error: "ID inválido" }
  }

  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || null,
    status: formData.get("status") || "ativo",
  }

  const result = customerSchema.safeParse(rawData)
  if (!result.success) {
    return { error: result.error.errors[0].message }
  }

  const { name, email, phone, status } = result.data

  const supabase = await createServiceClient()

  const { error } = await supabase
    .from("customers")
    .update({
      name,
      email,
      phone: phone || null,
      status,
    })
    .eq("id", idResult.data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/")
  return { success: true }
}

export async function deleteCustomer(id: string) {
  await requireAuth()

  const idResult = idSchema.safeParse(id)
  if (!idResult.success) {
    return { error: "ID inválido" }
  }

  const supabase = await createServiceClient()

  const { error } = await supabase.from("customers").delete().eq("id", idResult.data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/")
  return { success: true }
}
