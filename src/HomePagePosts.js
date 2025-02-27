import react from "react";
import { useDispatch,useSelector } from "react-redux";
import { useEffect,useState } from "react";
import { setPosts } from "./features/Posts";
import { useNavigate } from "react-router";
const HomePagePosts=({visitor})=>{

    const token = localStorage.getItem('token')            
    const apiUrl = process.env.REACT_APP_API_URL;

    const [loading,setLoading]=useState(true);


    const posts = useSelector(state=>state.posts.value);
    const postDispatch = useDispatch();
    const nav= useNavigate();

    useEffect(()=>{
        
        const functionToGetPostsData=async()=>{
            const getPostsDataResponse = await fetch(`${apiUrl}/posts/home`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          });
  
          if (!getPostsDataResponse.ok) {
            throw new Error("Failed to load posts data");
          }
  
          const postsData = await getPostsDataResponse.json();

          const postsDataWithImageUrl = await Promise.all(
            postsData.map(async (post) => {
                const imageUrl = await fetchImageUrl(post.image.imageName); // Ensure this is a valid async function
                console.log(`Got image_url as ${imageUrl}`);
                return {
                ...post,
                imageUrl,
                };
            })
            )  
            postDispatch(setPosts(postsDataWithImageUrl));
            };

            functionToGetPostsData();
          //enter imge data
        
          setLoading(false);
    },[visitor])

    const handleViewPost=(e,post_id)=>{
        //post page navigation
        e.preventDefault()
        nav(`/userposts/${visitor}/${post_id}`)
    }


    const fetchImageUrl = async (imageName) => {
        //function to get images from image name
        console.log("Called image data");
        try {
            const response = await fetch(`${apiUrl}/get-images/images/${imageName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            });
        
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            console.log(`Got image data: ${imageUrl}`);
            return imageUrl;
        } catch (error) {
            console.log("Unable to get image:", error);
        }
        };

    if (loading){
        return (<div>Loading...</div>)
    }else{
        return(
            <div className="home-posts-container">
                {posts.map(post=>(
                        <div className="post-container userprofile-posts-image">   
                        <img  onClick={(e)=>handleViewPost(e,post.post_id)} src={post.imageUrl}></img>
                          </div>    
                    ))}
            </div>
        )
        
    }
    
}

export default HomePagePosts;