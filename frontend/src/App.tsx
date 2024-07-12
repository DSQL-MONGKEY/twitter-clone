import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import SignUpPage from './pages/auth/signup/SignUpPage'
import HomePage from './pages/home/HomePage'
import LoginPage from './pages/auth/login/LoginPage'
import Sidebar from './components/common/Sidebar'
import RightPanel from './components/common/RightPanel'
import NotificationPage from './pages/notification/NotificationPage'
import ProfilePage from './pages/profile/ProfilePage'
import { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from './components/common/LoadingSpinner'

function App() {

   // this is called "query" that have authUser
   const { data:authUser, isLoading, } = useQuery({
      // queryKey to give a unique name to our query and refer to it later
      queryKey: ['authUser'],
      queryFn: async() => {
         try {
            const res = await fetch('/api/auth/me')
            const data = await res.json()

            if(data.error) return null
            if(!res.ok) {
               throw new Error(data.error || 'Something went wrong');
            }
            console.log('This is authUser: ', data);
            return data;
         } catch (error) {
            if(error instanceof Error) {
               throw new Error(error.message);
            }
         }
      },
      retry: false
   })

   if(isLoading) {
      return (
         <div className='flex h-screen justify-center items-start'>
            <LoadingSpinner size='xl' />
         </div>
      )
   }

   return (
      <div className='flex max-w-6xl mx-auto'>
         {authUser && <Sidebar />}
         <Routes>
         <Route path='/' element={authUser ? <HomePage /> : <Navigate to={'/login'} />} />
         <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={'/'} />} />
         <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to={'/'} />} />
         <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to={'/login'} />} />
         <Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to={'/login'} />} />
         </Routes>
         {authUser && <RightPanel />}
         <Toaster />
      </div>
   )
}

export default App
