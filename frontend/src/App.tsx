import { Route, Routes } from 'react-router-dom'
import './App.css'
import { SignupForm } from './pages/auth/signup-form'
import { ThemeProvider } from './components/themes/theme-provider'
import { Dashboard } from './pages/dashboard'

function App() {

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<SignupForm />} />
        <Route path="/auth/signin" element={"HI"} />
        <Route path="/__dashboard" element={<Dashboard />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
