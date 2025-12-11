export interface Customer {
  id: string
  name: string
  email: string | null
  phone: string | null
  status: "ativo" | "inativo"
  created_at: string
}
