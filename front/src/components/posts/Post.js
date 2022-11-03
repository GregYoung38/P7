import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import TextareaAutosize from 'react-textarea-autosize';

import Modal from '../modals/ModUpdPost'
import Comment from './Comment'
import CommentAdd from './CommentAdd'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCommentDots, faHeart } from "@fortawesome/free-solid-svg-icons"

import { getToken, axios } from "../../tools/requests";     /*** FONCTIONS GLOBALES ***/

import user_default from '../../assets/mesimages/user_default.webp'
import uuid from 'react-uuid';
import { Popup } from '../modals/ModAlerts';

export default function ThisPost(props) {
    const dispatch = useDispatch();

    const { active_user } = useSelector((state) => state);
    const [userconfig, setUserconfig] = useState(active_user)
    const [userAuthor, setUserAuthor] = useState(false)

    const { posts } = useSelector((state) => state.posts);
    const [myPost, setMyPost] = useState(posts)                      // Infos **time** et **lap** ajoutées

    const { comment } = useSelector((state) => state.comment);
    const [myComment, setMyComment] = useState() 

    /* Important pour l'info de date du post en temps réel */
    const [time, setTime] = useState();
    const [dTime, setdTime] = useState();
    const [modal, setModal] = useState(false)
    const [member, setMember] = useState()
    const [likers, setLikers] = useState()

    const actionPopup = (bool) => {(!bool) && setShowPopup({ show: false, type: null, msg: null }) }
    const [showPopup, setShowPopup] = useState({ show: false, type: null, msg: null })
   
    const load_post = () => {     
        const info = {
            ...props.content,
            time : props.content.date_creation,
            lap : Math.floor((new Date(props.content.date_creation).getTime() / 60000))
        }
        console.log(info);
        setMyPost(info);
        
        (async () => { load_comments(props.content._id) })();   // Chargement des commentaires
    }
    const load_comments = (postID) => {
        fetch(`${process.env.REACT_APP_HOSTBACK}/api/posts/${postID}/getComments`, { 
            method: 'POST',
            headers: { Authorization: "Bearer "+getToken(),
                       'Content-Type': 'application/json' }
            // body: JSON.stringify({ 'userId': uid })
        })
        .then( (response) => {
            response.json()
            .then((res) => {     
                dispatch({ type: 'LOAD_COMMENTS', payload: res })
            })        
        })
        .catch(err => console.log(`Echec de la récupération du commentaire : ${postID} !`, err))
    }
    

    /* [info] Personnalisation des dates de création des posts --------------------------------------------------- */
    setInterval( function() {         
        // Définit le nb de minutes écoulé entre le 1er Janvier 1970 et la date actuelle (rafraîchissement toutes les minutes)
        const userOffset = new Date().getTimezoneOffset();
        var now = Math.floor((new Date().getTime() /60000) - userOffset);
        setTime(now)
    }, 60000 )

    useEffect(() => {  
        if (myPost && myPost.time && myPost.lap > 0) { 
            /* 
                [info] Cette partie personnalise les dates de posts & commentaires sous la forme : 
                [info] aujourd'hui (hier, ou avant-hier) à HH:mm, ou bien le cas échéant JJ/MM/AAAA à HH:mm
                
                [*ex*] new Date()  =>  Format local de la date actuelle
                [*ex*] time        =>  Différence en mn entre le 01/01/1970 et maintenant
                [*ex*] myPost.time =>  2022-10-21T19:43:34.288Z
            */
            
            const datePost = new Date(myPost.time).toLocaleString();                         
            const total = (time - myPost.lap);                                   // minutes entre le post et maintenant (1440 mn/jour)
            const sum = (new Date().getHours()*60) + (new Date().getMinutes())   // minutes entre le post et ce matin à 00:00           
            const postTime = (myPost.time).substr(11,5);                         // heure:minutes de la création du post
            
            if (total <= sum) {
                setdTime('aujourd\'hui à ' + postTime)
            }
            else {
                if(total < (1440 + sum)) setdTime('hier à ' + postTime)                
                else if (total < (2880 + sum)) setdTime('avant-hier à ' + postTime)
                else setdTime(String(datePost).slice(0,10) + ' à ' + postTime)     
            }
        }
    }, [time]);
    /* [info] ---------------------------------------------------------------------------------------------------- */

    useEffect(() => { 
        const uid = userconfig.user.userId;     // Utilisateur connecté
        const aut = props.content.idAuthor;     // Auteur de la publication

        // Récupérer les informations de l'auteur de la publication
        axios('user').get(`/getUserById/${aut}`)
        .then(res => { setMember(res.data) })        
        .catch(err => console.log(`Echec de la récupération de l'auteur !`, err.data.message));

        (uid === aut) ? setUserAuthor(true) : setUserAuthor(false);

        load_post()                            // Affichage de la publication
        setLikers(props.content.usersLiked);
        
        setInterval( function() {         
            // Définit le nb de minutes écoulé entre le 1er Janvier 1970 et la date actuelle (rafraîchissement toutes les minutes)
            const userOffset = new Date().getTimezoneOffset();
            var now = Math.floor((new Date().getTime() /60000) - userOffset);
            setTime(now)
        },100)
    }, []);

    useEffect(() => { setMyComment({ ...myComment, comment }) }, [comment]);


    const displayNbComments = () => {
        var nb = 0;  
        comment.map( (item, index) => {
            (item.refId === myPost._id) && nb++
        })
        
        return nb
    }
    const openModal = (bool, data) => {
        if (modal) {  
            setModal(false) /* Cache la modale : */ 

            if (data) {                
                dispatch({ type: 'UPDATE_POST', payload: { data: data.content } });
                setMyPost({ 
                    ...myPost,
                    content: data.content.content, 
                    sharedImg: data.content.sharedImg
                });
                setShowPopup({ show: true, msg: `La publication a été mise à jour..` }) 
            }
        }
        else {
            setModal(true)  /* Affiche la modale : */
        }
    }
    
    function findLiker() {
        // Parcourir les utilisateurs qui ont liké
        var res = 1;
        try {            
            likers.map((el) => {
                if (el === userconfig.user.userId) res = 0
            })            
        }
        catch (err) { return 1 }
        return res
    }
    function sendLike() {
        const uid = userconfig.user.userId;

        fetch(`${process.env.REACT_APP_HOSTBACK}/api/posts/${myPost._id}/like`, { 
            method: 'POST',
            headers: { Authorization: "Bearer "+getToken(),
                       'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: uid, models: 'posts', like: findLiker() })
        })
        .then( (response) => {
            response.json()
            .then((res) => { 
                // [info] Ajouter ou supprimer l'utilisateur du state (selon la valeur de son like)
                if (response.status === 201) {
                    if (res.message === 'deleted') {
                        // Supprimer l'utilisateur à la collection
                        dispatch({ type: 'DELETE_LIKER', payload: { id: myPost._id, liker: uid } })
                        setLikers([ ...likers.filter((el) => el !== uid ) ])
                        setShowPopup({ show: true, type: 'info', msg: `Vous n'aimez plus cette publication` }) 
                    }
                    else {
                        // Ajouter l'utilisateur à la collection
                        dispatch({ type: 'ADD_LIKER', payload: { id: myPost._id, liker: uid } })
                        setLikers([ ...likers, uid ])
                        setShowPopup({ show: true, type: 'info', msg: `Vous aimez cette publication` }) 
                    }    
                }
            })        
        })
        .catch(err => console.log('Problème avec le Like d\'un post.. \r\n', err))
    }
    function deletePost() {
        axios('post').delete(`/deletePost/${myPost._id}`, { 
            headers: { 'Content-Type': 'application/json', 
                        Authorization: "Bearer "+getToken() }  
        })
        .then((res) => {
            console.log(res.status);
            if (res.status === 204) { 
                setShowPopup({ show: true, type: 'success', msg: `La publication va être supprimée..` });
                setTimeout( () => { dispatch({ type: 'DELETE_POST', payload: { id: myPost._id } }) },3000);
            }
        })
        .catch((err) => console.log('Problème avec DeletePost() \r\n', err.response) )
    }

    return (    
        (showPopup.show) ? (<Popup display={actionPopup} message={showPopup.msg} type={showPopup.type} key={uuid} />) : null,

        (member && 
            [      
                <div className='modalUpdate' key={100} >
                    {modal ? <Modal shown={openModal} content={myPost} key={1} /> : null}
                </div>,

                <article key={200} >
                    <div className="post-head">            
                        <div className="post-avatar">
                            <img src={!member.photo ? user_default : `${process.env.REACT_APP_PICS_PROFILES}${member.photo}`} alt="user profile" width='58px' height='58px' />  
                        </div>

                        <div className="post-body">
                            <div className="part-user">
                                <h2>{ member.pseudo }</h2>  {/* NomUser */} 
                                <h2>{ dTime }</h2>          {/* DatePost dTime */}
                            </div>

                            <hr size="1" color="lightslategray" />

                            <div className="post-comment"> 
                                {/* Le texte pourrait ne pas être fourni */} 
                                { myPost && myPost.content && 
                                    <div className="TA">
                                        <TextareaAutosize className="new-comment" spellCheck={false} aria-label="texte de la publication"
                                                          contentEditable={false} value={ myPost.content } />
                                    </div>
                                }

                                {/* L'image pourrait ne pas être fournie */}
                                { myPost && myPost.sharedImg && 
                                    <figure>                                        
                                        <img src={ myPost.sharedImg } alt={!myPost.alt ? `image partagée par ${userconfig.user.pseudo}` : myPost.alt}  />
                                    </figure>
                                }                 
                            </div>

                            <div className="post-buttons">                    
                                <div>
                                    { (userconfig.user.isAdmin || userAuthor) && (<button onClick={openModal}>modifier</button>) } 
                                    { (userconfig.user.isAdmin || userAuthor) && (<button onClick={deletePost}>supprimer</button>) } 
                                </div>               

                                {/* NbComments */}
                                {displayNbComments()>0 && <h4>{displayNbComments() } commentaire{displayNbComments()>1 && 's' }</h4>}           
                            </div>
                            
                            <div className="post-bandeau">
                                <ul>
                                    <li className={likers.length >0 ? 'link active' : 'link'} 
                                        onClick={sendLike} >
                                            <FontAwesomeIcon icon={faHeart} 
                                                             className={findLiker() === 0 ? 'svg-inline--fa fa-heart active' : 'svg-inline--fa fa-heart'} />
                                            {likers.length >0 && `(${likers.length})` }
                                    </li>

                                    <li className='link'>
                                        <a href={`#newcom-${props.content._id}`} aria-label={`Ecrire un nouveau post`}>
                                            <FontAwesomeIcon className="comment" icon={faCommentDots} />  
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* ExistingSubcomment */}
                            { myComment && 
                                myComment.comment.map( (item) => { 
                                    if (props.content._id === item.refId) { 
                                        return (<Comment content={item} key={item._id} />)  
                                    }
                                }) 
                            }                            

                            {/* NewComment */}
                            <CommentAdd id={ props.content._id } />
                        </div>
                    </div>        
                </article>
            ]
        )
    )
}