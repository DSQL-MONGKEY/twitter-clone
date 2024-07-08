import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useFollow = () => {
   const queryClient = useQueryClient();

   const { mutate:follow, isPending } = useMutation({
      mutationFn: async(userId) => {
         try {
            const res = await fetch(`/api/users/follow/${userId}`, {
               method: 'POST'
            });
            const data = res.json();

            if(!res.ok) {
               throw new Erorr(data.error || 'Somthing went wrong');
            }
            return data;
         } catch (error) {
            throw new Error(error);
         }
      },
      onSuccess: () => {
         Promise.all([
            queryClient.invalidateQueries({ queryKey: ['authUser'] }),
            queryClient.invalidateQueries({ queryKey: ['suggestedUsers'] })
         ])
         toast.success('User followed successfully');
      },
      onError: (error) => {
         toast.error(error.message);
      }
   });

   return { follow, isPending };
};

export default useFollow;


/**
 * @hooks
 * 
 * 
 */