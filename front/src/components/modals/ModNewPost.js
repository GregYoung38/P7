import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { Popup } from '../modals/ModAlerts';
import TextareaAutosize from 'react-textarea-autosize';

import { v4 as uuid } from "uuid";

import btncloseOff from '../../assets/mesimages/close0.webp'
import btncloseOn from '../../assets/mesimages/close1.webp'

import { getToken, axios, getUTCtime } from "../../tools/requests";     /*** FONCTIONS GLOBALES ***/

export default function ModNewPost(props) {   
    const { active_user } = useSelector((state) => state);  
    const [redaction, setRedaction] = useState('');     // Textarea
    const [image, setImage] = useState(null);
    const [imageUpdated, setImageUpdated] = useState('');
    const [altText, setAltText] = useState(); 
    const [showAlt, setShowAlt] = useState(false); 
        
    const actionPopup = (bool) => {(!bool) && setShowPopup({ show: false, type: null, msg: null }) }
    const [showPopup, setShowPopup] = useState({ show: false, type: null, msg: null })

    function createPost() {
        const token = getToken();

        if (token !== null) {   
            var DONNEES = new FormData(); 
            DONNEES.append("idAuthor", active_user.user.userId);
            DONNEES.append('date_creation', getUTCtime());          /* Date de création */

            if (redaction) DONNEES.append('content', redaction);    /* Rédaction facultative */
            if (image) DONNEES.append('sharedImg', image);          /* Image facultative */
            if (altText) DONNEES.append('sharedImgAlt', altText);            /* Texte alternatif facultatif */
            

            if (!redaction && !image) {
                /* Empêcher la création de la publication, si texte et image sont vides */
                setShowPopup({ show: true, type: 'alert', msg: `Vous devez au minimum, alimenter le champ texte ou fournir une image` })   
            }
            else {
                const head = { 
                    headers: {   
                        Accept: 'application/json, text/html',
                        "Content-Type": "multipart/form-data; charset=utf-8; boundary=----WebKitFormBoundarySd8PqpLTuffYJfYC",
                        Authorization: "Bearer "+token
                    }
                }

                axios('post').post('/createPost', DONNEES, head)
                .then((res) => {
                    if (res.status === 201) {
                        setShowPopup({ show: true, type: 'success', msg: `Le commentaire a été créé` })   
                        // [info] Fermer la modale en envoyant les nouvelles données
                        setTimeout( () => { props.shown(false, res.data) }, 3000);
                    }
                })
                .catch((err) => console.log('Problème d\'insertion de la publication.. \r\n', err.response) )
            }
        }
        else {
            setShowPopup({ show: true, type: 'error', msg: `Vous devez vous connecter..` })   
        }        
    }

    function writeText(e) {
        setRedaction(e.target.value);
    }
    function writeAlt(e) {
        setAltText(e.target.value);
    }
    function displayAlt(e) {
        (!showAlt ? setShowAlt(true) : setShowAlt(false))
    }
    function addPicture(e) {
        setImage(e.target.files[0])
        setImageUpdated(e.target.value)
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
        (showPopup.show) ? (<Popup display={actionPopup} message={showPopup.msg} type={showPopup.type} key={uuid()} />) : null,

        <div className="modal" key={uuid}>
            <div className="modal__content">
                <div className="modal__content__header">
                    <h1>Créer une publication</h1>
                    <img src={ btncloseOff } 
                         onClick={() => { props.shown(false) }} 
                         onMouseOver={(e) => { e.currentTarget.src = btncloseOn} }
                         onMouseOut={(e) => { e.currentTarget.src = btncloseOff} } 
                         alt='bouton pour fermer la modale' />
                </div>

                <hr size="1" />

                <div className="modal__content__body">
                    <div className="TA">
                        <TextareaAutosize spellCheck="false" onChange={(e) => { writeText(e) }} value={ redaction } />
                    </div>
                    <input type="file" id='input0' value={imageUpdated} onChange={(e) => addPicture(e) }/>
                    {image && <img src={URL.createObjectURL(image)} alt={"image à publier "+uuid()} />}

                    <div className='buttons'>
                        <button onClick={(e) => runInputFile(e)}>{!image && 'Ajouter une image'}{image && 'Modifier'}</button>  
                        {image && [
                                <button onClick={(e) => clearImage(e)} key={'btndel'}>Effacer</button>,
                                <button onClick={(e) => displayAlt(e)} key={'btnalt'}>Texte alt.</button>,
                                showAlt && (<input type="text" value={ altText } onChange={(e) => writeAlt(e) } key={'textalt'} />)
                            ]
                        } 
                    </div>                   
                </div>

                <hr size="1" />

                <div className="modal__content__footer">
                    <button onClick={() => {createPost()}}>PUBLIER</button>
                </div>   
            </div>     
        </div>
    ]
}