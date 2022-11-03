import React from 'react'
import { useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import closeOFF from '../../assets/mesimages/close0.webp';
import closeON from '../../assets/mesimages/close1.webp';

export default function ModMenu(props) {
    const dispatch = useDispatch();

    function disconnect() {
        dispatch({ type: 'CLEAR_USER', payload: '' })  
    }

    return (    
        <div className="modal menu">
            <img src={closeOFF} className='btn'
                 onClick={() => props.display(true) }  
                 onMouseOver={(e) => { e.currentTarget.src = closeON} }
                 onMouseOut={(e) => { e.currentTarget.src = closeOFF} } 
                 alt='bouton pour fermer la modale' />

            <h2>SOMMAIRE</h2>

            <NavLink to={'/home' } key='10'>
                <li>Accueil</li>
            </NavLink>

            <NavLink to={'/profile' } key='20'>
                <li>Profil</li>
            </NavLink>

            <NavLink to='/sign/connect' key='30'>
                <li onClick={ () => disconnect() }>déconnection</li>
            </NavLink> 
        </div>
    )
}
