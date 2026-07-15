import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './utils/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Hub from './pages/Hub'
import Dock from './pages/Dock'
import Match from './pages/Match'
import Logbook from './pages/Logbook'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/hub" element={
        <ProtectedRoute>
          <Hub />
        </ProtectedRoute>
      } />
      <Route path="/dock" element={
        <ProtectedRoute>
          <Dock />
        </ProtectedRoute>
      } />
      <Route path="/logbook" element={
        <ProtectedRoute>
          <Logbook />
        </ProtectedRoute>
      } />
      <Route path="/match/:id" element={
        <ProtectedRoute>
          <Match />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/hub" />} />
    </Routes>
  )
}

export default App
