import React, { useState } from 'react'
import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface FormStateTypes {
   email: string
   username: string
   fullName: string
   password: string
}

const SignUpPage = () => {
   const [formData, setFormData] = useState({
      email: '',
      username: '',
      fullName: '',
      password: ''
   });

   const { mutate:signup, isError, isPending, error } = useMutation({
      mutationFn: async({ email, username, fullName, password }:FormStateTypes) => {
         try {
            const res = await fetch('/api/auth/signup', {
               method: 'POST',
               headers: {
                  "Content-Type": "application/json"
               },
               body: JSON.stringify({ email, username, fullName, password })
            })

            const data = await res.json();
            if(!res.ok) throw new Error(data.error || 'Failed to create account');

            console.log(data);
            return data;
         } catch(error) {
            if(error instanceof Error) {
               throw new Error(error.message);
            }
         }
      },
      onSuccess: () => {
         toast.success('Account created successfully')
      },
   });

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      signup(formData);
      console.log(formData);
   }
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   }

   return (
      <div className='max-w-screen-xl mx-auto flex h-screen px-10'>
         <div className='flex-1 hidden lg:flex justify-center items-center'>
            <XSvg className='lg:w-2/3 fill-white' />
         </div>
         <div className='flex flex-1 flex-col justify-center items-center'>
            <form className='lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
               <XSvg className='w-24 lg:hidden fill-white' />
               <h1 className='text-4xl font-extrabold text-white'>
                  Join today.
               </h1>
               <label className='input input-bordered rounded flex items-center gap-2'>
                  <MdOutlineMail />
                  <input
                     type='email'
                     className='grow'
                     name='email' 
                     placeholder='Email'
                     onChange={handleInputChange}
                     value={formData.email}
                  />
               </label>
               <div className='flex flex-wrap flex-col gap-4'>
                  <label className='input input-bordered rounded flex items-center gap-2'>
                     <FaUser />
                     <input
                        type='text'
                        className='grow'
                        name='username'
                        placeholder='username'
                        onChange={handleInputChange}
                        value={formData.username}
                     />
                  </label>
                  <label className='input input-bordered rounded flex items-center gap-2'>
                     <MdDriveFileRenameOutline />
                     <input
                        type='text'
                        className='grow'
                        name='fullName'
                        placeholder='Full Name'
                        onChange={handleInputChange}
                        value={formData.fullName}
                     />
                  </label>
               </div>
               <label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							name='password'
							placeholder='Password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
               <button className='btn rounded-full btn-primary text-white'>
                  {isPending ? (
                     <span className='loading loading-spinner'></span>
                  ) : "Sign up"}
               </button>
               {
                  isError && (
                  <p className='text-red-500'>{error.message}</p>
               )}
            </form>
            <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
               <p className='text-white text-lg'>Already have an account?</p>
               <Link to={'/login'}>
                  <button className='btn rounded-full btn-primary text-white btn-outline w-full'>
                     Sign in
                  </button>
               </Link>
            </div>
         </div>
      </div>
   )
}

export default SignUpPage