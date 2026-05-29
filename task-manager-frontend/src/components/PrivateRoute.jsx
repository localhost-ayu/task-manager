import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  // Aguarda verificar o localStorage antes de decidir
  if (loading) {
    return <div>Carregando...</div>
  }

  return user ? children : <Navigate to="/login" replace />
}