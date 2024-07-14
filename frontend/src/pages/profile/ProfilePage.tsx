/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EditProfileModal from "./EditProfileModal";
import useFollow from "../../hooks/useFollow";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { formatMemberSinceDate } from "../../utils/date";
import useUpdateUserProfile from "../../hooks/useUpdateProfile";


interface ChangeImgParams  {
   (
      e: React.ChangeEvent<HTMLInputElement>,
      state: string
   ): void
}
type AuthUserType = {
   _id: string
   following: string[]
}

const ProfilePage = () => {
   const [coverImg, setCoverImg] = useState<any>(null);
   const [profileImg, setProfileImg] = useState<any>(null);
   const [feedType, setFeedType] = useState('posts');
   
   const coverImgRef = useRef<any>(null);
   const profileImgRef = useRef<any>(null);
   const { username } = useParams();

   const { data:authUser } = useQuery<AuthUserType>({ queryKey: ['authUser'] })
   const { data:posts } = useQuery<object[]>({ queryKey: ['posts'] });
   const { updateProfile, isUpdating } = useUpdateUserProfile();


   const { data:user, isLoading, isRefetching, refetch } = useQuery({
      queryKey: ['userProfile'],
      queryFn: async() => {
         try {
            const res = await fetch(`/api/users/profile/${username}`);
            const data = await res.json();

            if(!res.ok) {
               throw new Error(data.error || 'Something went wrong');
            }

            return data;
         } catch (error) {
            if(error instanceof Error) {
               throw new Error(error.message);
            }
         }
      }
   })

   const handleImgChange:ChangeImgParams = (e, state)  => {
      if(!e.target.files) return;
      const file = e.target.files[0];
      if(file) {
         const reader = new FileReader();
         reader.onload = () => {
            state === 'coverImg' && setCoverImg(reader.result);
            state === 'profileImg' && setProfileImg(reader.result);
         }
         reader.readAsDataURL(file)
      }
   };

   const handleUpdateProfile = async() => {
      await updateProfile({ coverImg, profileImg });
      setCoverImg(null);
      setProfileImg(null);
   }

   const { follow, isPending } = useFollow();
   const memberSinceDate = formatMemberSinceDate(user?.createdAt);
   const isMyProfile = authUser?._id === user?._id;
   const isFollowing = authUser?.following.includes(user?._id);

   useEffect(() => {
      refetch();
   }, [username, refetch, username])

   return (
      <div className='flex-[4_4_0] border-r border-slate-700'>
         {/* HEADER */}
         {(isLoading || isRefetching)&& <ProfileHeaderSkeleton />}
         {!isLoading && !isRefetching && !user && (
            <p className='text-center text-lg mt-4'>
               User not found
            </p>
         )}
         <div className='flex flex-col'>
            {!isLoading && !isRefetching && user && (
               <>
                  <div className='flex gap-10 px-4 py-2 items-center'>
                     <Link to={'/'}>
                        <FaArrowLeft className='h-4 w-4' />
                     </Link>
                     <div className='flex flex-col'>
                        <p className='font-bold text-lg'>{user?.fullName}</p>
                        <span className='text-sm text-slate-500'>
                           {posts?.length} posts
                        </span>
                     </div>
                  </div>
                  {/* Cover image */}
                  <div className='relative group/cover'>
                     <img
                        src={coverImg || user?.coverImg || './cover.png'}
                        className='h-52 w-full object-cover'
                        alt='cover-image'
                     />
                     {isMyProfile && (
                        <div className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer group-hover/cover:opacity-100 transition duration-200' 
                        onClick={() => coverImgRef.current.click()}>
                           <MdEdit className='h-5 w-5 text-white' />
                        </div>
                     )}
                     <input 
                        type="file"
                        hidden
                        accept="image/*"
                        ref={coverImgRef}
                        onChange={(e) => handleImgChange(e, "coverImg")}
                     />
                     <input 
                        type="file"
                        hidden
                        accept="image/*"
                        ref={profileImgRef}
                        onChange={(e) => handleImgChange(e, "profileImg")}
                     />
                     {/* User avatar */}
                     <div className='avatar absolute -bottom-16 left-4'>
                        <div className='w-32 rounded-full relative group/avatar'>
                           <img
                              src={profileImg || user?.profileImg || "/avatar-placeholder.png"}
                           />
                           <div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
                              {isMyProfile && (
                                 <MdEdit
                                    className='w-4 h-4 text-white'
                                    onClick={() => profileImgRef.current.click()}
                                 />
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
                  {/* User options Follow, update-profile */}
                  <div className='flex justify-end px-4 mt-5'>
                     {isMyProfile && <EditProfileModal authUser={authUser} />}
                     {!isMyProfile && (
                        <button className='btn btn-outline rounded-full btn-sm' onClick={() => follow(user?._id)}>
                           {isPending && (
                              <LoadingSpinner size="sm" />
                           )}
                           {!isPending && isFollowing && 'Unfollow'}
                           {!isPending && !isFollowing && 'Follow'}
                        </button>
                     )}
                     {(profileImg || coverImg) && (
                        <button className='btn btn-primary btn-sm rounded-full text-white px-4 ml-2' onClick={handleUpdateProfile}>
                           {isUpdating ? (
                              <LoadingSpinner size="md" />
                           ) : 'Update'}
                        </button>
                     )}
                  </div>
                  {/* User info */}
                  <div className='flex flex-col gap-4 mt-14 px-4'>
                     <div className='flex flex-col text-start'>
                        <span className='font-bold text-lg'>
                           {user?.fullName}
                        </span>
                        <span className='text-sm text-slate-500'>
                           @{user?.username}
                        </span>
                        <span className='text-sm my-1'>
                           {user?.bio}
                        </span>
                     </div>
                     {user?.link && (
                        <div className='flex gap-1 items-center'>
                           <>
                              <FaLink className='w-3 h-3 text-slate-500' />
                              <a 
                                 href='https://dimp-port.vercel.com'
                                 target='_blank'
                                 rel='noreferrer'
                                 className='text-sm text-blue-500 hover:outline'
                              >
                                 {user?. link}
                              </a>
                           </>
                        </div>
                     )}

                     <div className='flex gap-2 items-center'>
                        <IoCalendarOutline className='w-4 h-4 text-slate-500' />
                        <span className='text-sm text-slate-500'>
                           {memberSinceDate}
                        </span>
                     </div>

                     <div className='flex gap-2'>
                        <div className='flex gap-1 items-center'>
                           <span className='font-bold text-xs'>{user?.following.length}</span>
                           <span className='text-slate-500 text-xs'>Following</span>
                        </div>
                        <div className='flex gap-1 items-center'>
                           <span className='font-bold text-xs'>{user?.followers.length}</span>
                           <span className='text-slate-500 text-xs'>Followers</span>
                        </div>
                     </div>

                     <div className='flex w-full border-b border-gray-700 mt-4'>
                        <div
                           className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer'
                           onClick={() => setFeedType("posts")}
                        >
									Posts
									{feedType === "posts" && (
										<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
									)}
								</div>
                        <div
									className='flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("likes")}
								>
									Likes
									{feedType === "likes" && (
										<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />
									)}
								</div>
                     </div>
                  </div>
               </>
            )}
            <Posts feedType={feedType} username={username} userId={user?._id} />
         </div>
      </div>
   )
}

export default ProfilePage