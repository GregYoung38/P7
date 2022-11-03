import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'

import { NavLink } from 'react-router-dom'
import ModMenu from '../modals/ModMenu'
import { v4 as uuidv4 } from "uuid";
import hamburger from '../../assets/mesimages/hamburger.webp';

export default function Menu() { 
    const { active_user } = useSelector((state) => state);
    const [userconfig, setUserconfig] = useState(active_user)
    const [userAdmin, setUserAdmin] = useState(userconfig.user.isAdmin)
    const { menus } = useSelector((state) => state);
    const [menuIndex, setMenuIndex] = useState(menus)
    const [miniMenu, setMiniMenu] = useState(false)

    const tabMenu = [
        { link: '/home', name: 'Accueil', class: 'first', tab: 1},
        { link: '/profile', name: 'Profil', class: 'last', tab: 2}
    ];

    /* Affiche ou Cache le menu responsive */
    const openResponsiveMenu = (bool) => {         
        (miniMenu) ? setMiniMenu(false) : setMiniMenu(true)  
    }

    return (        
        <div className="navigation">
            <nav>
                <ul>    
                    { tabMenu.map((el, index) => {
                        return (   
                            <div key={uuidv4()}> 
                                <NavLink 
                                    to={ el.link }>
                                        <li className={ (el.tab === menus.menu) ? (el.class+' current') : (el.class) } key={el.tab} >
                                        { el.name }
                                        </li>
                                </NavLink>
                                {(el.tab === menus.menu) && <div className='palet'></div> }
                            </div>
                        )
                    }) }
                </ul>

                <img src={hamburger} className='hamburger' onClick={() => setMiniMenu(true)} alt="icone de menu hamburger" width="50px" />
                {miniMenu ? <ModMenu display={ openResponsiveMenu } /> : null}                
            </nav>
        </div>
    )
};