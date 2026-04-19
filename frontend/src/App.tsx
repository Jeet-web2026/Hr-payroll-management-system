import { Route, Routes } from 'react-router-dom'
import './App.css'
import { ThemeProvider } from './components/themes/theme-provider'
import { Dashboard } from './pages/dashboard'
import { SigninForm } from './pages/auth/signin-form'
import { SignupForm } from './pages/auth/signup-form'
import OtpVerification from './pages/auth/otpVerification'
import { useEffect } from 'react'
import apiService from './comon/api/apiService'
import { TokenService } from './comon/api/tokenService'

function App() {
  useEffect(() => {
    const restoreSession = async () => {
      if (TokenService.get()) return;

      try {
        const res = await apiService.post('/auth/refresh');
        TokenService.set(res.data.data.accessToken);
      } catch {
        TokenService.clear();
      }
    };

    restoreSession();
  }, []);
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<SigninForm />} />
        <Route path="/auth/signup" element={<SignupForm />} />
        <Route path="/__dashboard" element={<Dashboard />} />
        <Route path='/auth/otp-verification' element={<OtpVerification />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
