import react from "react";
import { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "./features/Posts";
import { useNavigate } from "react-router";


const UserProfilePosts=({username})=>{

    const token = localStorage.getItem('token')            
    const apiUrl = process.env.REACT_APP_API_URL;

    const [loading,setLoading]=useState(true);

    const nav = useNavigate();
    const posts = useSelector(state=>state.posts.value);
    const postDispatch = useDispatch();

    useEffect(()=>{

        const getPostsData=async()=>{
                // Fetch posts data
                const responseToGetPosts = await fetch(`${apiUrl}/posts/home/${username}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
    
                if (!responseToGetPosts.ok) {
                    setPostFetchError("unable to get data")
                }
    
                const postsData = await responseToGetPosts.json();
                
                const postsDataWithImageUrl = await Promise.all(
                    postsData.map(async (post) => {
                        const imageUrl = await fetchImageUrl(post.image.imageName); // Ensure this is a valid async function
                        console.log(`Got image_url as ${imageUrl}`);
                        return {
                        ...post,
                        imageUrl,
                        };
                    })
                    );


                postDispatch(setPosts(postsDataWithImageUrl));
                
            }
            console.log("got posts data")
            getPostsData();
            setLoading(false);
            console.log(posts);
        },[username])

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
        
    
    const handleViewPost=(e,post_id)=>{
            e.preventDefault()
            nav(`/userposts/${username}/${post_id}`)
        }
    
    if (loading){
        return (<div>..loading</div>)
    }else{
        return(
            <div className="home-posts-container">
                {posts.map(post=>(
                    <div className="post-container userprofile-posts-image" key={post.post_id}>
                        <img  onClick={(e)=>handleViewPost(e,post.post_id)} key={post.post_id} src={post.imageUrl}></img>
                        </div>    
                ))}
            </div> 
            
        )
    }
    
}

export default UserProfilePosts;
