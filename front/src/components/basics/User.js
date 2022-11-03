import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
import imgDefault from '../../assets/mesimages/user_default.webp'

const User = () => {  
    const dispatch = useDispatch();
    const { active_user } = useSelector((state) => state);
    const [userConfig, setUserConfig] = useState(active_user)   

    useEffect( () => {         
        setUserConfig({ 
            user: {
                ...active_user.user,
                mail: active_user.user.mail,
                pseudo : active_user.user.pseudo,
                photo: active_user.user.photo ? `${process.env.REACT_APP_PICS_PROFILES}${active_user.user.photo}` : imgDefault
            }            
        })
    }, [active_user.user]); 

    const disconnect = () => { dispatch({ type: 'CLEAR_USER' }) }    

    return (
        <div className="connectzone">        
            <div>
                <h2>{ userConfig.user.pseudo }</h2>
                <ul>
                    <NavLink to='/sign/connect'>
                        <li onClick={ () => disconnect() }>
                            déconnection
                        </li>
                    </NavLink> 
                </ul>
            </div>     

            <img alt="user profile" src={ userConfig.user.photo } className={ userConfig.user.isAdmin ? "master" : null } width='50px' height='50px' />  
        </div>
    )
} 
  
export default User;