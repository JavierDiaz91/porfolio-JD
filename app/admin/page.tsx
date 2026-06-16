// Deja de buscar AdminLayout dentro de AdminDashboard. Cada uno desde su archivo:
import { AdminDashboard } from "@/components/AdminDashboard" 
import { AdminLayout } from "@/components/AdminLayout" 

export const metadata = {
  title: "Admin | Javier Diaz Portfolio",
  description: "Panel de administración del portfolio",
}

export default function AdminPage() {
  return <AdminDashboard />
}