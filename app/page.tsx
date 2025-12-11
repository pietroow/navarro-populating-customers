import { createServiceClient } from "@/lib/supabase/server"
import type { Customer } from "@/lib/types"
import { CustomerTable } from "@/components/customer-table"
import { CustomerDialog } from "@/components/customer-dialog"
import { SearchBar } from "@/components/search-bar"
import { Users } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"
import { requireAuth } from "@/app/actions/auth"

function sanitizeSearchInput(input: string): string {
  return input
    .replace(/[%_\\]/g, (char) => `\\${char}`)
    .replace(/['"`;()]/g, "")
    .slice(0, 100)
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string; pageSize?: string }>
}) {
  await requireAuth()

  const { search: rawSearch, page = "1", pageSize = "10" } = await searchParams
  const search = rawSearch ? sanitizeSearchInput(rawSearch) : undefined
  const currentPage = Math.max(1, Math.floor(Number(page)) || 1)
  const itemsPerPage = Math.min(100, Math.max(1, Math.floor(Number(pageSize)) || 10))
  const offset = (currentPage - 1) * itemsPerPage

  const supabase = await createServiceClient()

  let countQuery = supabase.from("customers").select("*", { count: "exact", head: true })

  if (search) {
    countQuery = countQuery.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
  }

  const { count } = await countQuery

  let query = supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + itemsPerPage - 1)

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
  }

  const { data: customers } = await query.returns<Customer[]>()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-semibold">Gestão de Clientes</h1>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <SearchBar />
            <CustomerDialog mode="create" />
          </div>

          <CustomerTable customers={customers || []} totalCount={count || 0} />
        </div>
      </main>
    </div>
  )
}
