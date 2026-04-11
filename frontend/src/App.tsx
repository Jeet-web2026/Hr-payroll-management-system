import { Route, Routes } from 'react-router-dom'
import './App.css'
import { ThemeProvider } from './components/themes/theme-provider'
import { Dashboard } from './pages/dashboard'
import { SigninForm } from './pages/auth/signin-form'
import { SignupForm } from './pages/auth/signup-form'

function App() {

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<SigninForm />} />
        <Route path="/auth/signup" element={<SignupForm />} />
        <Route path="/__dashboard" element={<Dashboard />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
