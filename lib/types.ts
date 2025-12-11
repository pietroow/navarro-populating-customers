export interface Customer {
  id: string
  name: string
  email: string
  phone: string | null
  status: "ativo" | "inativo"
  created_at: string
}
