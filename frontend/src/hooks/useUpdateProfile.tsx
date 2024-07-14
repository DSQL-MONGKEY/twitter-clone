/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";

const useUpdateUserProfile = () => {
   const queryClient = useQueryClient();
   const { mutateAsync:updateProfile, isPending:isUpdating } = useMutation<any>({
      mutationFn: async(formData) => {
         try {
            const res = await fetch(`/api/users/update`, {
               method: 'POST',
               headers: {
                  "Content-Type": "application/json"
               },
               body: JSON.stringify(formData)
            })
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
      },
      onSuccess: () => {
         toast.success('Profile updated successfully');
         Promise.all([
            queryClient.invalidateQueries({ queryKey: ['authUser'] }),
            queryClient.invalidateQueries({ queryKey: ['userProfile'] })
         ])
      }
   })

   return { updateProfile, isUpdating };
}

export default useUpdateUserProfile;