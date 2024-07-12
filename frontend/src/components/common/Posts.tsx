import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface PostsProps {
   feedType: string
   username?: string
   userId?: string
}

interface PostCallback {
   _id: string
   post: object[]
}

const Posts = ({ feedType, username, userId }: PostsProps) => {

   const getPostEndpoint = () => {
      switch(feedType){
         case "forYou":
            return '/api/posts/all';
         case "following":
            return '/api/posts/following';
         case "posts":
            return `/api/posts/user/${username}`;
         case "likes":
            return `/api/posts/likes/${userId}`;
         default:
            return '/api/posts/all'
      }
   }
   const POST_ENDPOINT = getPostEndpoint();

   const {data:posts, isLoading, isRefetching, refetch} = useQuery({
      queryKey: ['posts'],
      queryFn: async() => {
         try {
            const res = await fetch(POST_ENDPOINT);
            const data = await res.json();

            if(!res.ok) {
               throw new Error(data.error || 'Something went wrong');
            }

            return data;
         } catch(error) {
            if(error instanceof Error) {
               throw new Error(error.message);
            }
         }
      }
   })

   useEffect(() => {
      refetch();
   }, [feedType, refetch]);

   return (
      <>
         {(isLoading || isRefetching) && (
            <div className='flex flex-col justify-center'>
               <PostSkeleton />
               <PostSkeleton />
               <PostSkeleton />
            </div>
         )}
         {!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post: PostCallback) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
      </>
   )
}

export default Posts


/**
 * @state
 * isLoading = false
 * isRefetching = false
 *  
 * @explaination
 * {!isLoading(true) && !isRefetching(true) && posts?.length === 0}
 * 
 * when component is mounting the isLoading=true and isRefetching=false
 * but when the component re-render isLoading will be still 'false' 
 * and isRefetching will be swicth true-false depend on query refect()
 * 
 * isLoading change at the first time component is appear(mounting)
 * and that is still false until tab got refreshed   
 */