import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'
const Profile = ()=>{
    const {state,loading,dispatch}=useContext(UserContext)
    const [userProfile,setProfile]=useState(null)
    const {userid}=useParams()
    const [showFollow,setshowFollow]=useState(state?!state.following.includes(userid):true)
    // 
    useEffect(()=>{
     if(!loading){
         ((state==null)?console.log("loading"):
         fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            if(state.following.includes(userid)){
                setshowFollow(false)
            }
            else{
                setshowFollow(true)
            }
            setProfile(result)    
        })
        )
     }
    }
    ,[loading,state])

    const followUser = ()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        })
        .then(res=>res.json())
            .then(data=>{
                console.log(data)
                dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
                localStorage.setItem("user",JSON.stringify(data))
                setProfile((prevState)=>{
                    return {
                        ...prevState,
                        user:{
                            ...prevState.user,
                            followers:[...prevState.user.followers,data._id]
                        }
                    }
                })
                setshowFollow(false)
            })
    }
    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        })
        .then(res=>res.json())
            .then(data=>{
                console.log(data)
                dispatch({type:"UPDATE",payload:{following:data.following,
                followers:data.followers}})
                localStorage.setItem("user",JSON.stringify(data))
                setProfile((prevState)=>{
                    const newfollowers=prevState.user.followers.filter(item=>item!=data._id)
                    return {
                        ...prevState,
                        user:{
                            ...prevState.user,
                            followers:newfollowers
                        }
                    }
                })
                setshowFollow(true)
            })
    }

    return(

        <>
        {state&&userProfile? 
                <div style={{maxWidth:"550px",margin:"0px auto"}}>
                <div style={{
                    display:"flex",
                    justifyContent:"space-around",
                    margin:"18px 0px",
                    borderBottom:"1px solid grey"
                }}>
                    <div>
                        <img style={{display:"block",maxWidth:"160px",maxHeight:"160px",width:"auto",height:"auto",borderRadius:"80px"}}
                        src={userProfile.user.pic}
                        />
                    </div>
                    <div>
                        <h4>{userProfile.user.name}</h4>
                        <h5>{userProfile.user.email}</h5>
                        <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                            <h6>{userProfile.posts.length} posts</h6>
                            <h6>{userProfile.user.followers.length} followers</h6>
                            <h6>{userProfile.user.following.length} following</h6>
                        </div>
                        {showFollow?
                        <button style={{margin:"10px"}} className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>followUser()}>Follow
                        </button> 
                        :
                        <button style={{margin:"10px"}} className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>unfollowUser()}>UnFollow
                        </button> 
                        }
                    </div>
                </div>
                <div className="gallery">
                    {
                        userProfile.posts.map(item=>{
                            return(
                                <img key={item._id} className="item" src={item.photo}/>
                                )
                        })
                        
                    }
                </div>
            </div> 
        :<h2>loading ...</h2>}
  
        </>  

    )
}

export default Profile