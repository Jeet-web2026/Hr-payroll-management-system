import { Route, Routes } from 'react-router-dom'
import './App.css'
import { SignupForm } from './components/signup-form'
import { ThemeProvider } from './components/themes/theme-provider'

function App() {

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<SignupForm />} />
        <Route path="/auth/signin" element={"HI"} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
