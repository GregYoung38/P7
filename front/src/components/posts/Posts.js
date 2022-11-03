import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';

import Navigation from '../basics/Navigation'
import User from '../basics/User'
import Modal from '../modals/ModNewPost'
import ThisPost from './Post';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"

import { getToken, axios } from "../../tools/requests";     /*** FONCTIONS GLOBALES ***/

var displayRecords = 5;        // Nbre de publications initiales affichées

const Posts = (props) => {  
    const dispatch = useDispatch();
    const goto = useNavigate();

    const { active_user } = useSelector((state) => state);
    const [userConfig, setUserConfig] = useState()

    const { menus } = useSelector((state) => state);
    const [menuIndex, setMenuIndex] = useState(menus)

    const { posts } = useSelector((state) => state.posts);
    const [publis, setPublis] = useState();

    const [modal, setModal] = useState(false)
    const [scrollPosition, setScrollPosition] = useState(0);     
    

    useEffect(() => { 
        setUserConfig(props.uid);
        document.querySelector('.container').classList.remove('loginform');
        dispatch({ type:'SET_MENU', payload: { index: 1 } });
        (async () => { load_posts(displayRecords) })();
    }, []);

    useEffect(() => { if (posts && posts.length > 0) setPublis({ ...publis, posts }); }, [posts]);

    /* [info] CHARGEMENT INSTANTANE DE x POSTS QUAND LE SCROLL EST EN BAS DE PAGE --------------------------------------- */    
    const handleScroll = () => {        
        const position = window.pageYOffset;
        setScrollPosition(position);            //console.log(position, '-->', sbHeight0, '-->', sbHeight2)
        
        var total = Math.round(position + window.innerHeight);
        if (total +2 > document.body.offsetHeight) {            
            displayRecords += 2;
            (async () => { load_posts(displayRecords) })();
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);        
        return () => { window.removeEventListener("scroll", handleScroll); }         
    });
    /* [info] ----------------------------------------------------------------------------------------------------------- */
       

    const load_posts = (nb) => {  
        axios('post').post(`/getPosts`, 
            {   limit: nb },
            {   headers: { 'Content-Type': 'application/json', 
                            Authorization: "Bearer "+getToken() }                 
        })
        .then((res) => {
            // Afficher les publications
            (res.status === 200) && dispatch({ type: 'LOAD_POSTS', payload: res.data })     
        })
        .catch((err) => console.log('Echec de la récupération des posts ! \r\n', err.response) )
    }

    const openModal = (bool, data) => {        
        if (modal) {  
            setModal(false) /* Cache la modale : */
            if (data) dispatch({ type: 'ADD_POST', payload: data.content })
        }
        else {
            setModal(true)  /* Affiche la modale : */
        }
    }

    return (
        <section>
            <div className='header-nav'>
                <Navigation />
                <FontAwesomeIcon icon={faEdit} 
                                 onClick={(e) => { openModal(e) } } 
                                 title='écrire une publication' />
                <User />
            </div>
            
            {/* Modale pour ajouter un post */}
            {modal ? <Modal shown={openModal} /> : null}

            {/* Afficher les posts */}
            { publis && publis.posts.map( (item) => {
                return (<ThisPost content={item} key={item._id}/>);
              }) 
            }
        </section>
    )
}
  
export default Posts