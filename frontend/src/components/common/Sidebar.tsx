
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import XSvg from '../svgs/X';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

type AuthUserType = {
   profileImg: string
   username: string
   fullName: string
}

const Sidebar = () => {
   const queryClient = useQueryClient();
   const { mutate:logout } = useMutation({
      mutationFn: async() => {
         try {
            const res = await fetch('/api/auth/logout', {
               method: 'POST'
            })
            const data = await res.json();

            if(!res.ok) throw new Error(data.error || 'Something went wrong');
         } catch (error) {
            if(error instanceof Error) {
               throw new Error(error.message);
            }
         }
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['authUser'] });
         toast.success('Logout successfully')
      },
      onError: () => {
         toast.error('Logout failed')
      }
   })

   const { data:authUser } = useQuery<AuthUserType>({ queryKey: ['authUser'] })

   return (
      <div className='w-18 max-w-52 md:flex[2_2_0]'>
         <div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full'>
            <Link to={'/'} className='flex justify-center md:justify-start'>
               <XSvg className='px-2 w-12 h-12 rounded-full fill-white hover:fill-black hover:bg-white transition duration-100' />
            </Link>
            <ul className='flex flex-col gap-3 mt-4'>
               <li className='flex justify-center md:justify-start'>
                  <Link to={'/'} className='flex gap-3 items-center hover:bg-stone-900 transition-all duration-300 rounded-full py-2 pl-2 pr-4 max-w-fit cursor-pointer '>
                     <MdHomeFilled />
                     <span className='text-lg hidden md:block'>Home</span>
                  </Link>
               </li>
               <li className='flex justify-center md:justify-start'>
                  <Link to={'/notifications'} className='flex gap-3 items-center hover:bg-stone-900 transition-all duration-300 rounded-full py-2 pl-2 pr-4 max-w-fit cursor-pointer '>
                     <IoNotifications />
                     <span className='text-lg hidden md:block'>Notifications</span>
                  </Link>
               </li>
               <li className='flex justify-center md:justify-start'>
                  <Link to={`/profile/${authUser?.username}`} className='flex gap-3 items-center hover:bg-stone-900 transition-all duration-300 rounded-full py-2 pl-2 pr-4 max-w-fit cursor-pointer '>
                     <FaUser />
                     <span className='text-lg hidden md:block'>Profile</span>
                  </Link>
               </li>
            </ul>
            {authUser && (
               <div className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full mr-2'>
                  <Link to={`/profile/${authUser?.username}`} className='flex gap-2 items-start'>
                  <div className='avatar hidden md:inline-flex'>
                     <div className='w-8 rounded-full'>
                        <img src={authUser?.profileImg || '/avatar-placeholder.png'} alt="profile-image" />
                     </div>
                  </div>
                  <div className='flex flex-1 justify-between'>
                     <div className='hidden md:block'>
                        <p className='text-white font-bold text-sm w-20 truncate'>
                           {authUser?.fullName}
                        </p>
                        <p className='text-slate-500 text-sm'>
                           @{authUser?.username}
                        </p>
                     </div>
                  </div>
               </Link>   
                  <BiLogOut 
                     className='w-5 h-5 cursor-pointer' 
                     onClick={() => logout()}
                  />
               </div>
            )}
         </div>
      </div>
   )
}

export default Sidebar

/**
 *  @className : Arbitrary Value
 *  flex[4_4_0] = flex[grow, shrink, basis]
*/