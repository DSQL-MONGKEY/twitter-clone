import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


const NotificationPage = () => {
   const queryClient = useQueryClient();
   const { data:notifications, isLoading } = useQuery({
      queryKey: ['notifications'],
      queryFn: async() => {
         try {
            const res = await fetch('/api/notifications', {
               method: 'GET'
            });
            const data = await res.json();
            
            if(!res.ok) {
               throw new Error(data.error || 'Something went wrong');
            }
            return data;
         } catch (error) {
            throw new Error(error)
         }
      },
   })

   const { mutate:deleteNotifications } = useMutation({
      mutationFn: async() => {
         try {
            const res = await fetch('/api/notifications', {
               method: 'DELETE'
            })
            const data = await res.json();

            if(!res.ok) {
               throw new Error(data.error || 'Something went wrong');
            }
            return data;
         } catch (error) {
            throw new Error(error);
         }
      },
      onSuccess: () => {
         toast.success('Notifications deleted')
         queryClient.invalidateQueries({ queryKey: ['notifications'] })
      }
   })

   const { data:authUser } = useQuery({ queryKey: ['authUser'] });

   const handleDelete = () => {
      deleteNotifications()
   }

   return (
      <div className='flex-[4_4_0] border-l border-r boer-grayrd-700 min-h-screen'>
         <div className='flex justify-between items-center p-4 border-b bordero-gray-700'>
            <p className='font-bold'>Notifications</p>
            <div className='dropdown'>
               <div className='m-1' tabIndex={0} role='button'>
                  <IoSettingsOutline className='w-4' />
               </div>
               <ul className='dropdown-content z-[1] menu p-2 bg-base-100 rounded-box w-52' tabIndex={0}>
                  <li>
                     <a onClick={handleDelete}>
                        Delete all notifications
                     </a>
                  </li>
               </ul>
            </div>
         </div>
         {isLoading && (
            <div className='flex justify-center h-full items-center'>
               <LoadingSpinner size="lg" />
            </div>
         )}
         {notifications?.length === 0 && (
            <div className='text-center p-4 font-bold'>
               No notifications 🤔
            </div>
         )}
         {notifications?.map((notification) => (
            <div className='border-b border-gray-700' key={notification._id}>
               <div className='flex gap-2 p-4'>
                  {notification.type === "follow" && (
                     <FaUser className='w-7 h-7 text-primary' />
                  )}
                  {notification.type === "like" && (
                     <FaHeart className='w-7 h-7 text-red-500' />
                  )}
                  <Link to={`/profile/${notification?.from.username}`} className="flex items-center gap-2">
                     <div className='avatar'>
                        <div className='w-8 rounded-full'>
                           <img src={notification?.from.profileImg || "/avatar-placeholder.png"} />
                        </div>
                     </div>
                     <div className='flex gap-1'>
                        <span className='font-bold'>
                           {notification?.from.username === authUser?.username ? (
                              'You'
                           ) : (
                              <span>
                                 @{notification?.from.username}
                              </span>
                           )}
                        </span>{" "}
                        {notification.type === "follow" ? "followed you" : "liked your post"}
                     </div>
						</Link>
               </div>
            </div>
         ))}
      </div>
   )
}

export default NotificationPage