import { Route, Routes } from 'react-router-dom'
import './App.css'
import { ThemeProvider } from './components/themes/theme-provider'
import { Dashboard } from './pages/dashboard'
import { SigninForm } from './pages/auth/signin-form'
import { SignupForm } from './pages/auth/signup-form'
import OtpVerification from './pages/auth/otpVerification'
import { AuthSuccess } from './pages/auth/authSuccess'
import ProtectedRoute from './comon/providers/protectedRouteProvider'
import PublicRoute from './comon/providers/publicRouteProvider'
import { MyInfo } from './pages/myInfo'
import { Inbox } from './pages/others/inbox'
import { Calender } from './pages/management/calender'
import { PermissionManagement } from './pages/management/permission-management'
import { Userview } from './pages/user/view'
import { EditUser } from './pages/user/edit'

function App() {

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <SigninForm />
          </PublicRoute>
        } />
        <Route path="/auth/signup" element={
          <PublicRoute>
            <SignupForm />
          </PublicRoute>
        } />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/account" element={
          <ProtectedRoute>
            <MyInfo />
          </ProtectedRoute>
        } />
        <Route path='/auth/otp-verification' element={
          <PublicRoute>
            <OtpVerification />
          </PublicRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/inbox" element={
          <ProtectedRoute>
            <Inbox />
          </ProtectedRoute>
        } />
        <Route path="/calender" element={
          <ProtectedRoute>
            <Calender />
          </ProtectedRoute>
        } />
        <Route path="/manage-permissions" element={
          <ProtectedRoute>
            <PermissionManagement />
          </ProtectedRoute>
        } />
        <Route path="/user/view/:userId" element={
          <ProtectedRoute>
            <Userview />
          </ProtectedRoute>
        } />
        <Route path="/user/edit/:userId" element={
          <ProtectedRoute>
            <EditUser />
          </ProtectedRoute>
        } />
      </Routes>
    </ThemeProvider>
  )
}

export default App
