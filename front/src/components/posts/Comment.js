import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';

import user_default from '../../assets/mesimages/user_default.webp'

import { getToken, axios } from "../../tools/requests";     /*** FONCTIONS GLOBALES ***/
import { Popup } from '../modals/ModAlerts';
import { v4 as uuidv4 } from "uuid";
import uuid from 'react-uuid';

export default function Comment(props) {
    const dispatch = useDispatch();

    const actionPopup = (bool) => {(!bool) && setShowPopup({ show: false, type: null, msg: null }) }
    const [showPopup, setShowPopup] = useState({ show: false, type: null, msg: null })

    const {active_user} = useSelector((state) => state);
    const [userconfig, setUserconfig] = useState(active_user)
    const [author, setAuthor] = useState({ name: '', avatar: ''});
    const [redaction, setRedaction] = useState('');
    const [likers, setLikers] = useState()
    const [inUpdate, setInUpdate] = useState(false);    

    const textareaContent = useRef();    

    useEffect(() => { 
        setRedaction(props.content.content) 
        setLikers(props.content.usersLiked);

        // Récupérer les informations de l'auteur du commentaire
        const head = {
            headers: { 
                authorization: `Bearer ${getToken()}`               
            }
        }

        axios('user').get(`/getUserById/${props.content.userId}`, head)
        .then(res => { 
            setAuthor({ 
                name: res.data.pseudo, 
                avatar: res.data.photo 
            })             
        })        
        .catch(err => setShowPopup({ show: true, msg: `Echec de la récupération de l'auteur !\r\n ${err.message}` }) )
    }, []);

    useEffect(() => { 
        /* [info] Gère la modification sur le champ de saisie */
        try {
            const elem = textareaContent.current;    
            (inUpdate) ? elem.classList.add('in-update') : elem.classList.remove('in-update')            
        }
        catch (err) {
            setShowPopup({ show: true, msg: `${err.message}` })
        }        
    }, [inUpdate]);
    

    function writeText(e) {
        e.preventDefault()
        setRedaction(e.target.value)         
    }
    
    function findLiker() {
        // [info] Parcourir les utilisateurs qui ont liké
        // [info] En déduire si l'utilsateur final a lui-même déjà liké ce commentaire..

        try {
            var res = 1;
            likers.map((el) => {
                if (el === userconfig.user.userId) res = 0
            })
            return res
        }
        catch(err) { 
            return 1
        }
    }
    function sendLike() {
        const uid = userconfig.user.userId;

        fetch(`${process.env.REACT_APP_HOSTBACK}/api/posts/${props.content._id}/like`, { 
            method: 'POST',
            headers: { Authorization: "Bearer "+getToken(),
                        'Content-Type': 'application/json' 
                    },
            body: JSON.stringify({ userId: uid, models: 'comments', like: findLiker() })
        })
        .then( (response) => {
            response.json()
            .then((res) => { 
                // [info] Ajouter ou supprimer l'utilisateur du state (selon la valeur de son like)
                if (response.status === 201) {
                    if (res.message === 'deleted') {
                        // Supprimer l'utilisateur à la collection
                        dispatch({ type: 'DELETE_LIKER', payload: { id: props.id, liker: uid } })
                        setLikers([ ...likers.filter((el) => el !== uid ) ])
                        setShowPopup({ show: true, type: 'info', msg: `Vous n'aimez plus cette publication` })
                    }
                    else {
                        // Ajouter l'utilisateur à la collection
                        dispatch({ type: 'ADD_LIKER', payload: { id: props.id, liker: uid } })
                        setLikers([ ...likers, uid ])
                        setShowPopup({ show: true, type: 'info', msg: `Vous aimez cette publication` })
                    }    
                }
            })        
        })
        .catch(err => `Problème avec le Like.. \r\n ${err}` )
    }

    function updateComment() {
        const token = getToken();

        if (token !== null) {
            const head = {
                headers: { 
                    authorization: `Bearer ${token}`               
                }
            }

            let formData = { content: redaction }
            if (!redaction) {
                /* Empêcher la création de la publication, si texte est vide */
                setShowPopup({ show: true, type: 'alert', msg: `Vous devez alimenter le champ texte` });
            }
            else {
                axios('post').put(`${props.content._id}/updateComment`, formData, head)
                .then((res) => {
                    if (res.status === 201) {                        
                        dispatch({ type: 'UPDATE_COMMENT', payload: { content: res.data.content } });                             
                        setShowPopup({ show: true, type: 'success', msg: `Le commentaire a été modifié` });    
                        setInUpdate(false);                                 
                    }
                })
                .catch((err) => console.log(`Erreur de modification du commentaire..\r\n ${err.response}` ) )
            }
        }
        else {
            setShowPopup({ show: true, type: 'error', msg: `Vous devez vous connecter..` })
        }        
    }
    const updatingComment = (e) => {
        e.preventDefault();        
        (inUpdate) ? setInUpdate(false) : setInUpdate(true)        
    }
    function deleteComment() {
        axios('post').delete(`/deleteComment/${props.content._id}`, { 
            headers: { 'Content-Type': 'application/json', 
                        Authorization: "Bearer "+getToken() }  
        })
        .then((res) => {
            if (res.status === 204) {             
                setShowPopup({ show: true, type: 'success', msg: `Le commentaire va être supprimé` })   
                setTimeout( () => { dispatch({ type: 'DELETE_COMMENT', payload: { id: props.content._id } }) },3000)                 
            }
        })
        .catch((err) => alert(`Problème de suppression du commentaire\r\n ${err}`) )
    }

    return [
        (showPopup.show) ? (<Popup display={actionPopup} message={showPopup.msg} type={showPopup.type} key={uuidv4} />) : null,

        <div className="part-comment" key={uuid}>                          
            <img src={(author.avatar === '') ? user_default : `${process.env.REACT_APP_PICS_PROFILES}${author.avatar}`} alt="user profile" />   {/* ImageUsr */}   

            <div>
                <div className="TA">
                    <h2>{ author.name } a écrit :</h2>
                    <TextareaAutosize className="new-comment" ref={textareaContent} 
                                      spellCheck={false} aria-label="commentaire enregistré"
                                      onChange={(e) => { writeText(e)}} defaultValue={redaction}/>

                    { !inUpdate && 
                        <button className={likers && findLiker() === 0 ? 'on' : null} onClick={sendLike}>
                            j'aime {likers && likers.length >0 && `(${likers.length})`}
                        </button>
                    }

                    {/* Uniquement pour l'auteur OU l'administrateur.. --------------------------- */}
                    { userconfig.user.isAdmin || userconfig.user.userId === props.content.userId ?
                        [
                            !inUpdate && <button onClick={(e) => updatingComment(e)} key={'btnupd'+props.content._id}>modifier</button>,
                            inUpdate && <button onClick={(e) => updateComment(e)} key={'btnupdf'+props.content._id}>enregistrer</button>,
                            !inUpdate && <button onClick={deleteComment} key={'btndel'+props.content._id}>supprimer</button>  
                        ] 
                        : null
                    }
                    {/* -------------------------------------------------------------------------- */}
                </div> 
            </div>                       
        </div>
    ]
}
