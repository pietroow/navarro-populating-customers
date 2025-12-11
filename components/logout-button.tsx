"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { logoutAction } from "@/app/actions/auth"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await logoutAction()
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      <LogOut className="h-4 w-4 mr-2" />
      Sair
    </Button>
  )
}
