"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Customer } from "@/lib/types"
import { Plus, Pencil } from "lucide-react"
import { useState, useTransition } from "react"
import { createCustomer, updateCustomer } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import { formatPhoneNumber, unformatPhoneNumber } from "@/lib/utils/phone-mask"

interface CustomerDialogProps {
  customer?: Customer
  mode: "create" | "edit"
}

export function CustomerDialog({ customer, mode }: CustomerDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const [phone, setPhone] = useState(customer?.phone || "")
  const [status, setStatus] = useState<"ativo" | "inativo">(customer?.status || "ativo")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set("phone", unformatPhoneNumber(phone))
    formData.set("status", status)

    startTransition(async () => {
      const result = mode === "create" ? await createCustomer(formData) : await updateCustomer(customer!.id, formData)

      if (result.error) {
        toast({
          title: "Erro",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Sucesso",
          description: `Cliente ${mode === "create" ? "criado" : "atualizado"} com sucesso`,
        })
        setOpen(false)
      }
    })
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Cliente
          </Button>
        ) : (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{mode === "create" ? "Adicionar Cliente" : "Editar Cliente"}</DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "Adicione um novo cliente ao seu banco de dados."
                : "Atualize as informações do cliente."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" defaultValue={customer?.name} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" defaultValue={customer?.email} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(99) 99999-9999"
                maxLength={15}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as "ativo" | "inativo")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
