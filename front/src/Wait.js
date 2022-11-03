import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faTrashCan, faSpinner, faCommentDots, faHeart, faEdit } from "@fortawesome/free-solid-svg-icons"

export default function Wait() {
    const goto = useNavigate();
    const { active_user } = useSelector((state) => state);
    const [userconfig, setUserconfig] = useState({ active_user })

    useEffect( () => {
        (active_user.user.userId) && setUserconfig(active_user)
    })

    setTimeout( () => {
        if (userconfig.user !== undefined) {
            (userconfig.user.userId) ? goto('/home') : goto('/sign/connect')
        }
        else {
            goto('/sign/connect')
        }
    }, 250)


    return (
        <div className="pageSpinner">
            <FontAwesomeIcon className="spinner" size="3x" icon={faSpinner} /> 
        </div>       
    )
}