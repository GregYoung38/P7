import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { v4 as uuidv4 } from "uuid";
import uuid from 'react-uuid';

import { Popup } from '../modals/ModAlerts';
import TextareaAutosize from 'react-textarea-autosize';

import btncloseOff from '../../assets/mesimages/close0.webp'
import btncloseOn from '../../assets/mesimages/close1.webp'

import { getToken, axios, getUTCtime } from "../../tools/requests";     /*** FONCTIONS GLOBALES ***/

export default function ModNewPost(props) {   
    const {active_user} = useSelector((state) => state);    
    const [redaction, setRedaction] = useState('');         // Uniquement pour le Textarea
    const [image, setImage] = useState();
    const [imageUpdated, setImageUpdated] = useState('');

    const actionPopup = (bool) => {(!bool) && setShowPopup({ show: false, type: null, msg: null }) }
    const [showPopup, setShowPopup] = useState({ show: false, type: null, msg: null })

    useEffect(() => {
        if (props.content.sharedImg) setImage(props.content.sharedImg)

        // Supprimer les champs inutiles pour le reducer..
        Reflect.deleteProperty(props.content, 'lap');
        Reflect.deleteProperty(props.content, 'time');

        setRedaction(props.content.content);
    }, []);
    
    function updatePost() {
        const token = getToken();

        if (token !== null) {
            var DONNEES = new FormData();
            DONNEES.append("idAuthor", active_user.user.userId);
            DONNEES.append('date_creation', getUTCtime());          /* Date de création */
            DONNEES.append('content', redaction);    /* Rédaction facultative */
            (image) ? DONNEES.append('sharedImg', image) : DONNEES.append('sharedImg', '') ;          /* Image facultative */
            //if (altText) DONNEES.append('alt', altText);            /* Texte alternatif facultatif */

            if (!redaction && !image) {
                // [info] Interdire la création de la publication, si texte ET image sont vides */
                setShowPopup({ show: true, type: 'alert', msg: `Vous devez au minimum, écrire quelque chose ou fournir une image` })   
            }
            else {
                const head = { 
                    headers: {   
                        Accept: 'application/json, text/html',
                        "Content-Type": "multipart/form-data; charset=utf-8; boundary=----WebKitFormBoundarySd8PqpLTuffYJfYC",
                        Authorization: "Bearer "+token
                    }
                }

                axios('post').put(`/updatePost/${props.content._id}`, DONNEES, head)
                .then((res) => {
                    // [info] Fermer la modale en envoyant les nouvelles données
                    if (res.status === 200) {
                        setShowPopup({ show: true, type: 'success', msg: `La publication va être mise à jour` })   
                        setTimeout( () => { props.shown(false, res.data) }, 3000);
                    }
                })
                .catch((err) => console.log('Problème de mise à jour pour la publication.. \r\n', err.response) )
            }
        }
        else {
            setShowPopup({ show: true, type: 'error', msg: `Vous devez vous connecter..` })   
        }        
    }

    function writeText(e) { setRedaction(e.target.value) }
    function addPicture(e) {
        setImage(e.target.files[0])
        setImageUpdated(e.target.value)
    }
    function displayPicture() {        
        if (imageUpdated) { return URL.createObjectURL(image) }
        else { 
            if (image) { return image }
        }
    }
    function clearImage(e) {
        setImage()
        setImageUpdated()
    }
    function runInputFile(e) {
        e.preventDefault();
        document.querySelector('#input0').click()
    }

    return [
        (showPopup.show) ? (<Popup display={actionPopup} message={showPopup.msg} type={showPopup.type} key={uuidv4} />) : null,

        <div className="modal" key={uuid}>
            <div className="modal__content">
                <div className="modal__content__header">
                    <h1>Modifiez votre publication</h1>
                    <img src={ btncloseOff } 
                         onClick={() => { props.shown(false) }} 
                         onMouseOver={(e) => { e.currentTarget.src = btncloseOn } }
                         onMouseOut={(e) => { e.currentTarget.src = btncloseOff } } 
                         alt='bouton pour fermer la modale' />
                </div>

                <hr size="1" />

                <div className="modal__content__body">
                    <div className="TA">
                        <TextareaAutosize id="taBody" spellCheck="false" onChange={(e) => { writeText(e) }} defaultValue={ props.content.content } />
                    </div>
                    <input type="file" id='input0' value={''} onChange={(e) => addPicture(e) } />
                    {image && <img src={displayPicture()} alt={"image à publier "+uuidv4()} />}

                    <div className='buttons'>
                        <button onClick={(e) => runInputFile(e)}>{!image && 'Ajouter une image'}{image && 'Modifier l\'image'}</button>  
                        {image && <button onClick={(e) => clearImage(e)}>Effacer l'image'</button>} 
                    </div>                 
                </div>

                <hr size="1" />

                <div className="modal__content__footer">
                    <button onClick={() => {updatePost()}}>METTRE A JOUR</button>
                </div>   
            </div>     
        </div>
    ]    
}