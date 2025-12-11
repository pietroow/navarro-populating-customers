"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDeferredValue, useEffect, useState } from "react"

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const deferredSearch = useDeferredValue(search)

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (deferredSearch) {
      params.set("search", deferredSearch)
    } else {
      params.delete("search")
    }

    if (params.toString() !== searchParams.toString()) {
      router.push(`?${params.toString()}`)
    }
  }, [deferredSearch, router, searchParams])

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar clientes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-9"
      />
    </div>
  )
}
