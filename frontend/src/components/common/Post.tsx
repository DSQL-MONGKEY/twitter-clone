import React, { useState } from "react";
import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";

interface PostProps {
   post: object
}


const Post = ({ post }: PostProps) => {
   const [comment, setComment] = useState<string>('');
   const { data:authUser } = useQuery({queryKey:['authUser']})
   const queryClient = useQueryClient();
   const postOwner = post.user;

   const { mutate:deletePost, isPending:isDeleting } = useMutation({
      mutationFn: async() => {
         try {
            const res = await fetch(`/api/posts/${post._id}`, {
               method: 'DELETE'
            });
            const data = res.json();
   
            if(!res.ok) {
               throw new Error(data.error || 'Something went wrong')
            }
            return data;
         } catch (error) {
            throw new Error(error);
         }
      },
      onSuccess: () => {
         toast.success('Post deleted successfully');
         queryClient.invalidateQueries({ queryKey: ['posts'] })
      }
   })

   const { mutate:likePost, isPending:isLiking } = useMutation({
      mutationFn: async() => {
         try {
            const res = await fetch(`/api/posts/like/${post._id}`, {
               method: 'POST',
            });
            const data = await res.json();

            if(!res.ok) {
               throw new Error(data.error || 'Something went wrong');
            }
            return data;
         } catch (error) {
            throw new Error(error);
         }
      },
      onSuccess: (updatedLikes) => {
         /**
          * @perf -
          *  this is not the best way for UX, bc it will refetch the all post
          *  queryClient.invalidateQueries({ queryKey: ['posts'] });
          * @solution
          *  instead, update the cache 'directly for that post' 
          */
         queryClient.setQueryData(['posts'], (oldData: object[]) => {
            return oldData.map((p: object) => {
               if(p._id === post._id) {
                  return {...p, likes: updatedLikes};
               }
               return p;
            })
         })
      },
      onError: (error) => {
         toast.error(error.message);
      } 
   })

   const { mutate:commentPost, isPending:isCommenting } = useMutation({
      mutationFn: async() => {
         try {
            const res = await fetch(`/api/posts/comment/${post._id}`, {
               method: 'POST',
               headers: {
                  "Content-Type": "application/json"
               },
               body: JSON.stringify({ text: comment })
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
      onSuccess: (updatedComments) => {
         setComment('');
         toast.success('Comment posted');
         /**
          * @perf -
          *  this is not the best way for UX, bc it will refetch the all post
          *  queryClient.invalidateQueries({ queryKey: ['posts'] });
          * @solution
          *  instead, update the cache 'directly for that post' 
          */
         queryClient.setQueryData(['posts'], (oldData:object[]) => {
            return oldData.map((p) => {
               if(p._id == post._id ) {
                  return {...p, comments: updatedComments};
               }
               return p;
            })
         })
      },
      onError: (error) => {
         toast.error(error.message);
      }
   });

   const isLiked = post.likes.includes(authUser._id);
   const isMyPost = authUser._id === post.user._id;
   const formattedDate = formatPostDate(post.createdAt);

   const handleDeletePost = () => {
      deletePost();
   }
   const handlePostComment = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      commentPost();
   }
   const handleLikePost = () => {
      likePost();
   }

   return (
      <>
         <div className='flex items-start p-4 gap-2 border-b border-gray-700'>
            {/* Avatar user profile */}
            <div className='avatar'>
               <Link to={`/profle/${postOwner.usernme}`} className='w-8 rounded-full overflow-hidden'>
                  <img 
                     src={postOwner.profileImg || '/avatar-placeholder.png'} alt="profile-image" 
                  />
               </Link>
            </div>
            {/* Name/username */}
            <div className='flex flex-col flex-1'>
               <div className='flex gap-2 items-center'>
                  <div>
                     <Link to={`/profile/${postOwner.username}`} className='font-bold'>
                        {postOwner.fullName}
                     </Link>
                  </div>
                  <span className='text-gray-700 flex gap-1 text-sm'>
                     <Link to={`/profile/${postOwner.username}`}>
                        @{postOwner.username}
                     </Link>
                     <span>.</span>
                     <span>{formattedDate}</span>
                  </span>
                  {isMyPost && (
                     <span className='flex flex-1 justify-end'>
                        {!isDeleting && (
                           <FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletePost} />
                        )}
                        {isDeleting && (
                           <LoadingSpinner size='xl' />
                        )}
                     </span>
                  )}
               </div>
               {/* Post image attachment */}
               <div className='flex flex-col gap-3 overflow-hidden'>
						<span className='text-start'>{post.text}</span>
						{post.img && (
							<img
								src={post.img}
								className='h-80 object-contain rounded-lg border border-gray-700'
								alt=''
							/>
						)}
					</div>
               {/* Option */}
               <div className='flex mt-3 gap-4 items-center w-full justify-between'>
                  {/* Comments */}
                  <div 
                     className='flex gap-1 items-center cursor-pointer group' 
                     onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
                  >
                     <FaRegComment className='w-4 h-4 text-slate-500 group-hover:text-sky-400' />
                     <span className='text-sm text-slate-500 group-hover:text-sky-400'>
                        {post.comments.length}
                     </span>
                  </div>
                  {/* We're using Modal Component from DaisyUI */}
                  <dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
                     <div className='modal-box rounded border border-gray-600'>
                        <h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
                        <div className='flex flex-col gap-3 max-h-60 overflow-auto'>
                           {post.comments.length === 0 && (
                              <p>No comments yet 🤔 Be the first one 😉</p>
                           )}
                           {post.comments.map((comment) => (
                              <div key={comment._id} className='flex gap-2 items-start'>
                                 <div className='avatar'>
                                    <div className='w-8 rounded-full'>
                                       <img src={comment.user.profileImg || "/avatar-placeholder.png"} alt="profileImg" />
                                    </div>
                                 </div>
                                 <div className='flex flex-col'>
                                    <div className='flex items-center gap-1'>
                                       <span className='font-bold'>
                                          {comment.user.fullName}
                                       </span>
                                       <span className='text-gray-700 text-sm'>
                                          @{comment.user.username}
                                       </span>
                                    </div>
                                    <div className='text-sm text-start'>
                                       {comment.text}
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                        {/* Form comment input field */}
                        <form
                           className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
                           onSubmit ={handlePostComment}
                        >
                           <textarea 
                              className='textarea w-full p-1 resize-none rounded text-md border focus:outline-none border-gray-800'
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                           />
                           <button 
                              disabled={comment == '' ? true : false} className='btn btn-primary btn-sm rounded-full text-white px-4 disabled:bg-slate-800'>
                              {isCommenting ? (
                                 <LoadingSpinner size='md' />
                              ) : (
                                 "Post"
                              )}
                           </button>
                        </form>
                     </div>
                     <form method='dialog' className='modal-backdrop'>
                        <button className='outline-none'>Close</button>
                     </form>
                  </dialog>
                  {/* Repost */}
                  <div className='flex gap-1 items-center group cursor-pointer'>
                        <BiRepost className='w-6 h-6 text-slate-500 group-hover:text-green-500' />
                        <span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
                  </div>
                  {/* Like */}
                  <div
                     className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}
                  >
                     {isLiking && <LoadingSpinner size='sm' />}
                     {!isLiked && !isLiking && (
                        <FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
                     )}
                     {isLiked && !isLiking && (
                        <FcLike className='w-4 h-4 cursor-pointer' />
                     )}
                     <span
                        className={`text-sm group-hover:text-pink-500 ${isLiked ? 'text-pink-500' : 'text-slate-500'}`}
                     >
                        {post.likes.length}
                     </span>
                  </div>
                  {/* Bookmark */}
                  <div className='flex gap-2 items-center'>
                     <FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}

export default Post