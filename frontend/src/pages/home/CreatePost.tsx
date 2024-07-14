/* eslint-disable @typescript-eslint/no-explicit-any */
import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import React, { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

type AuthUserType = {
   profileImg: string
}

const CreatePost = () => {
   const [text, setText] = useState<string>('');
   const [img, setImg] = useState<null|string>(null);
   const imgRef = useRef<any>(null);

   const queryClient = useQueryClient();
   const { data:authUser } = useQuery<AuthUserType>({ queryKey: ['authUser'] });

   const { mutate:createPost, isPending, isError, error } = useMutation({
      mutationFn: async() => {
         try {
            const res = await fetch('/api/posts/create', {
               method: 'POST',
               headers: {
                  "Content-Type": "application/json"
               },
               body: JSON.stringify({ text, img })
            });
            const data = await res.json();

            if(!res.ok) {
               throw new Error(data.error || 'Something went wrong')
            }
            return data;
         } catch (error) {
            if(error instanceof Error) {
               throw new Error(error.message);
            }
         }
      },
      onSuccess: () => {
         setText('');
         setImg(null);
         toast.success('Post created successfully');
         queryClient.invalidateQueries({ queryKey: ['posts'] })
      }
   })

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      createPost();
   }

   const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(!e.target.files) return;
      const file = (e.target.files)[0];

      if(file) {
         const reader = new FileReader();
         reader.onload = () => {
            const result: string = reader.result as string;
            setImg(result);
         }
         reader.readAsDataURL(file);
      }
   }
   const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
   }
   const handleCloseImg = () => {
      setImg(null);
      imgRef.current.value = null; 
   }

   return (
      <div className='flex p-4 items-start gap-4 border-b border-gray-700'>
         <div className='avatar'>
            <div className='w-8 rounded-full'>
               <img 
                  src={authUser?.profileImg || '/avatar-placeholder.png'} 
                  alt="profile-img" 
               />
            </div>
         </div>
         <form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
            <textarea
               className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800'
               placeholder="What's happening?!"
               value={text}
               onChange={handleTextChange}
            />
            {img && (
               <div className='relative w-72 mx-auto'>
                  <IoCloseSharp  
                     className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
                     onClick={handleCloseImg}
                  />
                  <img 
                     src={img} 
                     alt="post-image" 
                     className='w-full mx-auto h-72 object-contain rounded'
                  />
               </div>
            )}

            <div className='flex justify-between border-t py-2 border-t-gray-700'>
               <div className='flex gap-1 items-center'>
                  <CiImageOn
                     className='fill-primary w-6 h-6 cursor-pointer'
                     onClick={() => imgRef.current.click()}
                  />
                  <BsEmojiSmileFill 
                     className='fill-primary w-5 h-5 cursor-pointer'
                  />
               </div>
               <input 
                  type="file" 
                  hidden
                  ref={imgRef}
                  onChange={handleImgChange}
               />
               <button 
                  disabled={text == '' ? true : false} 
                  className='btn btn-primary rounded-full btn-sm text-white px-4 disabled:bg-slate-800'
               >
                  {isPending ? 'Posting...' : 'Post'}
               </button>
            </div>
            {isError && 
               <div className='text-red-500'>
                  {error.message}
               </div>
            }
         </form>
      </div>
   )
}

export default CreatePost