import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import user from '../../assets/mesimages/user_default.webp'

const Avatar = () => {  
    const { active_user } = useSelector((state) => state);
    const [userConfig, setUserConfig] = useState(active_user)
    const [userPhoto, setUserPhoto] = useState(userConfig.user.photo)

    useEffect( () => {         
        (userConfig.user.photo !== undefined) 
            ? setUserPhoto(`${process.env.REACT_APP_PICS_PROFILES}${userConfig.user.photo}`) 
            : setUserPhoto(user) 
    }, [userPhoto]); 

    return (
        <div className="avatar">
            <img alt="user profile" src={userPhoto ? userPhoto : user} />
        </div>
    )
  }
  
export default Avatar;