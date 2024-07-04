import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import React, { useState } from "react";
import { Link } from "react-router-dom";


const Post = ({ post }) => {
   const [comment, setComment] = useState<string>('');
   const postOwner = post.user;
   const isLiked = false;

   const isMyPost = true;
   const formattedDate = '1h';
   const isCommenting = false;

   const handleDeletePost = () => {}
   const handlePostComment = (e: React.FormEvent<HTMLTextAreaElement>) => {
      e.preventDefault();
   }
   const handleLikePost = () => {}

   return (
      <>
         <div className='flex item-start p-4 gap-4 border-b border-gray-700'>
            <div className='avatar'>
               <Link to={`/profle/${postOwner.usernme}`} className='w-8 rounded-full overflow-hidden'>
                  <img 
                     src={postOwner.profileImg || '/avatar-placeholder.png'} alt="profile-image" 
                  />
               </Link>
            </div>
            <div className='flex flex-col flex-1'>
               <div className='flex gap-2 items-center'>
                  <Link to={`/profile/${postOwner.username}`} className='font-bold'>
                     {postOwner.fullName}
                  </Link>
                  <span className='text-gray-700 flex gap-1 text-sm'>
                     <Link to={`/profile/${postOwner.username}`}>
                        @{postOwner.username}
                     </Link>
                     <span>.</span>
                     <span>{formattedDate}</span>
                  </span>
                  {isMyPost && (
                     <span className='flex flex-1 justify-end'>
                        <FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletePost} />
                     </span>
                  )}
               </div>
               
            </div>
         </div>
      </>
   )
}

export default Post