import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import TextareaAutosize from 'react-textarea-autosize';
import { Popup } from '../modals/ModAlerts.js';

import user_default from '../../assets/mesimages/user_default.webp'
import flch_off from '../../assets/mesimages/arrow-right-gray.webp'
import flch_on from '../../assets/mesimages/arrow-right-orange.webp'

import { getToken, axios, getUTCtime } from "../../tools/requests";     /*** FONCTIONS GLOBALES ***/

import { v4 as uuidv4 } from "uuid";
import uuid from 'react-uuid';

export default function Comment(props) {
    const dispatch = useDispatch();

    const { active_user } = useSelector((state) => state);
    const [userconfig, setUserconfig] = useState({...active_user})
    const { comment } = useSelector((state) => state.comment);    

    const actionPopup = (bool) => {(!bool) && setShowPopup({ show: false, type: null, msg: null }) }
    const [showPopup, setShowPopup] = useState({ show: false, type: null, msg: null })

    const [redaction, setRedaction] = useState();             // Textarea
    const writeText = e => { setRedaction(e.target.value) }

    function createComment() {        
        const token = getToken();

        if (token !== null) {
            const head = {
                headers: { 
                    authorization: `Bearer ${token}`                
                }
            }

            let formData = {
                refId: props.id,
                userId: userconfig.user.userId,
                content: redaction,
                date_creation: getUTCtime()              /* Image facultative */
            }

            if (!redaction) {
                /* Empêcher la création de la publication, si texte et image sont vides */
                setShowPopup({ show: true, type: 'alert', msg: 'Vous devez écrire quelquechose..' });
            }
            else {
                axios('post').post(`${props.id}/createComment`, formData, head)
                .then((res) => {
                    if (res.status === 201) {
                        setShowPopup({ show: true, type: 'success', msg: 'commentaire créé !' });
                        dispatch({ type: 'ADD_COMMENT', payload: res.data.content }) 
                        setRedaction('')
                    }
                })
                .catch((err) => setShowPopup({ show: true, type: 'error', delay: 2, msg: `Une erreur est survenue.. \r\n ${err.response}` }) )
            }
        }
        else {
            setShowPopup({ show: true, type: 'error', msg: 'Vous devez vous connecter..' });
        }        
    }
    
    return [
        (showPopup.show) ? (<Popup display={actionPopup} message={showPopup.msg} type={showPopup.type} key={uuidv4} />) : null,

        <div className="part-comment" id={`newcom-${props.id}`} key={uuid}>    
            {/* ImageUsr */}                
            <img src={!userconfig.user.photo ? user_default : `${process.env.REACT_APP_PICS_PROFILES}${userconfig.user.photo}`} alt="user profile" />   

            <div className="TA newComment">
                <TextareaAutosize className="new-comment" 
                                  spellCheck={false} 
                                  onChange={(e) => { writeText(e) }} 
                                  value={ redaction } 
                                  placeholder="Ecrivez votre commentaire"
                                  />
            </div>

            <img src={flch_off} alt="Bouton envoyer" onClick={() => {createComment()}}
                onMouseOver={(e) => { e.currentTarget.src = flch_on} }
                onMouseOut={(e) => { e.currentTarget.src = flch_off} } 
            />
        </div>
    ]
}